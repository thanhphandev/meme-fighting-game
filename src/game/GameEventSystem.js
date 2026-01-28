/**
 * GameEventSystem - Centralized Game Event Management
 * Handles announcements, round management, countdown, and game states
 */

import { SoundManager } from './SoundManager';
import { getDialogue, DIALOGUE_EVENTS } from './CharacterDialogues';

export const GAME_STATES = {
    LOADING: 'loading',
    COUNTDOWN: 'countdown',
    FIGHTING: 'fighting',
    ROUND_END: 'round_end',
    MATCH_END: 'match_end',
    PAUSED: 'paused',
};

export class GameEventSystem {
    constructor(options = {}) {
        this.state = GAME_STATES.LOADING;
        this.round = 1;
        this.maxRounds = options.maxRounds || 1; // Best of 1 by default
        this.p1Wins = 0;
        this.p2Wins = 0;

        this.countdownValue = 3;
        this.countdownTimer = 0;

        this.announcements = [];
        this.dialogueBubbles = [];

        this.onStateChange = options.onStateChange || (() => { });
        this.onAnnouncement = options.onAnnouncement || (() => { });
    }

    /**
     * Start the countdown sequence
     */
    startCountdown() {
        this.state = GAME_STATES.COUNTDOWN;
        this.countdownValue = 3;
        this.countdownTimer = 0;
        this.onStateChange(this.state);

        // Play countdown sound
        SoundManager.playSfx('announce_ready');
    }

    /**
     * Update countdown timer
     */
    updateCountdown(deltaTime) {
        if (this.state !== GAME_STATES.COUNTDOWN) return false;

        this.countdownTimer += deltaTime;

        if (this.countdownTimer >= 1000) {
            this.countdownTimer = 0;
            this.countdownValue--;

            if (this.countdownValue <= 0) {
                // Start fight!
                this.state = GAME_STATES.FIGHTING;
                this.onStateChange(this.state);
                this.showAnnouncement('FIGHT!', 'fight');
                SoundManager.playSfx('announce_fight');
                return true; // Fight started
            }
        }

        return false;
    }

    /**
     * Show an announcement on screen
     */
    showAnnouncement(text, type = 'normal', duration = 2000) {
        const announcement = {
            id: Date.now(),
            text,
            type, // 'fight', 'ko', 'round', 'normal'
            timer: duration,
            opacity: 1,
            scale: 1.5,
        };

        this.announcements.push(announcement);
        this.onAnnouncement(announcement);
    }

    /**
     * Update announcements
     */
    updateAnnouncements(deltaTime) {
        this.announcements.forEach(ann => {
            ann.timer -= deltaTime;
            if (ann.timer < 500) {
                ann.opacity = ann.timer / 500;
            }
            ann.scale = Math.max(1, ann.scale - deltaTime / 500);
        });

        this.announcements = this.announcements.filter(ann => ann.timer > 0);
    }

    /**
     * Show character dialogue bubble
     */
    showDialogue(characterId, event, x, y, isPlayer1 = true) {
        const text = getDialogue(characterId, event);

        const bubble = {
            id: Date.now() + Math.random(),
            text,
            x,
            y: y - 80, // Above character
            timer: 2000,
            opacity: 1,
            isPlayer1,
        };

        // Limit concurrent bubbles
        this.dialogueBubbles = this.dialogueBubbles.filter(b => b.timer > 500);
        if (this.dialogueBubbles.length < 4) {
            this.dialogueBubbles.push(bubble);
        }
    }

    /**
     * Update dialogue bubbles
     */
    updateDialogues(deltaTime) {
        this.dialogueBubbles.forEach(bubble => {
            bubble.timer -= deltaTime;
            bubble.y -= 0.3; // Float up
            if (bubble.timer < 500) {
                bubble.opacity = bubble.timer / 500;
            }
        });

        this.dialogueBubbles = this.dialogueBubbles.filter(b => b.timer > 0);
    }

    /**
     * Draw dialogue bubbles
     */
    drawDialogues(ctx) {
        this.dialogueBubbles.forEach(bubble => {
            ctx.save();
            ctx.globalAlpha = bubble.opacity;

            // Draw bubble background
            ctx.font = 'bold 16px "Comic Sans MS", sans-serif';
            const metrics = ctx.measureText(bubble.text);
            const padding = 12;
            const bubbleWidth = metrics.width + padding * 2;
            const bubbleHeight = 28;

            const x = Math.max(10, Math.min(bubble.x - bubbleWidth / 2, ctx.canvas.width - bubbleWidth - 10));
            const y = Math.max(10, bubble.y);

            // Bubble style based on player
            const bgColor = bubble.isPlayer1 ? '#22c55e' : '#ef4444';
            const borderColor = bubble.isPlayer1 ? '#15803d' : '#b91c1c';

            // Draw rounded bubble
            ctx.fillStyle = bgColor;
            ctx.strokeStyle = borderColor;
            ctx.lineWidth = 2;

            ctx.beginPath();
            ctx.roundRect(x, y, bubbleWidth, bubbleHeight, 8);
            ctx.fill();
            ctx.stroke();

            // Draw pointer
            const pointerX = Math.min(Math.max(bubble.x, x + 15), x + bubbleWidth - 15);
            ctx.beginPath();
            ctx.moveTo(pointerX - 6, y + bubbleHeight);
            ctx.lineTo(pointerX, y + bubbleHeight + 8);
            ctx.lineTo(pointerX + 6, y + bubbleHeight);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // Draw text
            ctx.fillStyle = '#fff';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(bubble.text, x + bubbleWidth / 2, y + bubbleHeight / 2);

            ctx.restore();
        });
    }

    /**
     * Draw announcements
     */
    drawAnnouncements(ctx) {
        this.announcements.forEach(ann => {
            ctx.save();
            ctx.globalAlpha = ann.opacity;

            const fontSize = ann.type === 'fight' ? 80 : (ann.type === 'ko' ? 100 : 48);
            ctx.font = `900 ${fontSize * ann.scale}px Bangers, Impact, sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            const centerX = ctx.canvas.width / 2;
            const centerY = ctx.canvas.height / 2 - 50;

            // Color based on type
            let color = '#FFD700';
            if (ann.type === 'ko') color = '#FF0000';
            if (ann.type === 'round') color = '#00FF00';

            // Stroke
            ctx.lineWidth = 8;
            ctx.strokeStyle = '#000';
            ctx.strokeText(ann.text, centerX, centerY);

            // Fill with gradient
            const gradient = ctx.createLinearGradient(centerX - 100, centerY - 30, centerX + 100, centerY + 30);
            gradient.addColorStop(0, color);
            gradient.addColorStop(0.5, '#FFFFFF');
            gradient.addColorStop(1, color);
            ctx.fillStyle = gradient;
            ctx.fillText(ann.text, centerX, centerY);

            ctx.restore();
        });
    }

    /**
     * Draw countdown
     */
    drawCountdown(ctx) {
        if (this.state !== GAME_STATES.COUNTDOWN) return;

        ctx.save();

        const centerX = ctx.canvas.width / 2;
        const centerY = ctx.canvas.height / 2 - 50;

        // Animate countdown number
        const progress = this.countdownTimer / 1000;
        const scale = 1 + (1 - progress) * 0.5;
        const opacity = 1 - progress * 0.3;

        ctx.globalAlpha = opacity;
        ctx.font = `900 ${120 * scale}px Bangers, Impact, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Stroke
        ctx.lineWidth = 10;
        ctx.strokeStyle = '#000';
        ctx.strokeText(this.countdownValue, centerX, centerY);

        // Gradient fill
        const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 80);
        gradient.addColorStop(0, '#FFD700');
        gradient.addColorStop(1, '#FF6600');
        ctx.fillStyle = gradient;
        ctx.fillText(this.countdownValue, centerX, centerY);

        ctx.restore();
    }

    /**
     * Handle round end
     */
    handleRoundEnd(winner) {
        if (winner === 'p1') {
            this.p1Wins++;
        } else {
            this.p2Wins++;
        }

        this.state = GAME_STATES.ROUND_END;
        this.showAnnouncement('K.O.!', 'ko', 1500);
        SoundManager.playSfx('announce_ko');

        // Check for match end
        const winsNeeded = Math.ceil(this.maxRounds / 2);
        if (this.p1Wins >= winsNeeded || this.p2Wins >= winsNeeded) {
            setTimeout(() => {
                this.state = GAME_STATES.MATCH_END;
                this.onStateChange(this.state);
            }, 1500);
        } else {
            // Next round
            setTimeout(() => {
                this.round++;
                this.startCountdown();
            }, 2000);
        }
    }

    /**
     * Get current round info
     */
    getRoundInfo() {
        return {
            round: this.round,
            maxRounds: this.maxRounds,
            p1Wins: this.p1Wins,
            p2Wins: this.p2Wins,
        };
    }

    /**
     * Update the system
     */
    update(deltaTime) {
        this.updateCountdown(deltaTime);
        this.updateAnnouncements(deltaTime);
        this.updateDialogues(deltaTime);
    }

    /**
     * Draw all UI elements
     */
    draw(ctx) {
        this.drawDialogues(ctx);
        this.drawAnnouncements(ctx);
        this.drawCountdown(ctx);
    }

    /**
     * Reset for new match
     */
    reset() {
        this.state = GAME_STATES.LOADING;
        this.round = 1;
        this.p1Wins = 0;
        this.p2Wins = 0;
        this.countdownValue = 3;
        this.countdownTimer = 0;
        this.announcements = [];
        this.dialogueBubbles = [];
    }
}
