/**
 * SoundManager - Production-ready Audio System
 * Handles BGM, SFX with mute/unmute, volume control
 */

class SoundManagerClass {
    constructor() {
        this.sounds = new Map();
        this.bgm = null;
        this.bgmVolume = 0.3;
        this.sfxVolume = 0.5;
        this.isMuted = false;
        this.isBgmMuted = false;
        this.isSfxMuted = false;

        // Sound definitions

        this.soundPaths = {
            // BGM
            bgm_menu: '/assets/sounds/bgm_menu.mp3',
            bgm_battle: '/assets/sounds/bgm_battle.mp3',
            bgm_victory: '/assets/sounds/bgm_victory.mp3',

            // SFX - Combat
            sfx_hit: '/assets/sounds/sfx_hit.mp3',
            sfx_hit_heavy: '/assets/sounds/sfx_hit_heavy.mp3',
            sfx_block: '/assets/sounds/sfx_block.mp3',
            sfx_whiff: '/assets/sounds/sfx_whiff.mp3',
            sfx_dash: '/assets/sounds/sfx_dash.mp3',
            sfx_jump: '/assets/sounds/sfx_jump.mp3',
            sfx_land: '/assets/sounds/sfx_land.mp3',

            // SFX - Skills
            sfx_skill_activate: '/assets/sounds/sfx_skill.mp3',
            sfx_projectile: '/assets/sounds/sfx_projectile.mp3',

            // SFX - UI
            sfx_select: '/assets/sounds/sfx_select.mp3',
            sfx_confirm: '/assets/sounds/sfx_confirm.mp3',
            sfx_cancel: '/assets/sounds/sfx_cancel.mp3',

            // SFX - Announcer
            announce_fight: '/assets/sounds/announce_fight.mp3',
            announce_ko: '/assets/sounds/announce_ko.mp3',
            announce_round1: '/assets/sounds/announce_round1.mp3',
            announce_round2: '/assets/sounds/announce_round2.mp3',
            announce_final: '/assets/sounds/announce_final.mp3',
            announce_ready: '/assets/sounds/announce_ready.mp3',
        };

        // Preload commonly used sounds
        this.preloadQueue = [
            'sfx_hit', 'sfx_block', 'sfx_skill_activate',
            'sfx_select', 'sfx_confirm'
        ];

        // Audio pool for SFX to limit concurrent playback
        this.activeSfxCount = 0;
        this.maxConcurrentSfx = 5;
    }

    /**
     * Preload sounds for smoother playback
     */
    async preload(soundKeys = this.preloadQueue) {
        const loadPromises = soundKeys.map(key => {
            return new Promise((resolve) => {
                if (this.soundPaths[key]) {
                    const audio = new Audio(this.soundPaths[key]);
                    audio.preload = 'auto';
                    audio.addEventListener('canplaythrough', () => {
                        this.sounds.set(key, audio);
                        resolve();
                    }, { once: true });
                    audio.addEventListener('error', () => {
                        if (import.meta.env.DEV) console.warn(`Failed to load sound: ${key}`);
                        resolve(); // Don't block on sound load failure
                    }, { once: true });
                } else {
                    resolve();
                }
            });
        });

        await Promise.all(loadPromises);
    }

    /**
     * Play a sound effect
     */
    playSfx(key, volumeMultiplier = 1) {
        if (this.isMuted || this.isSfxMuted) return;
        if (this.activeSfxCount >= this.maxConcurrentSfx) return;

        const path = this.soundPaths[key];
        if (!path) {
            if (import.meta.env.DEV) console.warn(`Sound not found: ${key}`);
            return;
        }

        // Use cached audio or create new one
        let audio = this.sounds.get(key);
        if (!audio) {
            audio = new Audio(path);
            this.sounds.set(key, audio);
        }

        // Clone for overlapping sounds but limit total
        const clone = audio.cloneNode();
        clone.volume = this.sfxVolume * volumeMultiplier;
        this.activeSfxCount++;

        clone.play().catch(() => {
            // Ignore autoplay restrictions
        });

        // Clean up when done
        clone.addEventListener('ended', () => {
            this.activeSfxCount--;
        }, { once: true });
    }

    /**
     * Play BGM (Background Music)
     */
    playBgm(key, loop = true) {
        if (this.isMuted || this.isBgmMuted) return;

        // Stop current BGM
        this.stopBgm();

        const path = this.soundPaths[key];
        if (!path) return;

        this.bgm = new Audio(path);
        this.bgm.volume = this.bgmVolume;
        this.bgm.loop = loop;
        this.bgm.play().catch(() => {
            // Handle autoplay restrictions
        });
    }

    /**
     * Stop BGM
     */
    stopBgm() {
        if (this.bgm) {
            this.bgm.pause();
            this.bgm.currentTime = 0;
            this.bgm = null;
        }
    }

    /**
     * Fade out BGM
     */
    fadeOutBgm(duration = 1000) {
        if (!this.bgm) return;

        const startVolume = this.bgm.volume;
        const steps = 20;
        const stepTime = duration / steps;
        const volumeStep = startVolume / steps;

        let step = 0;
        const fadeInterval = setInterval(() => {
            step++;
            if (step >= steps || !this.bgm) {
                clearInterval(fadeInterval);
                this.stopBgm();
            } else {
                this.bgm.volume = Math.max(0, startVolume - (volumeStep * step));
            }
        }, stepTime);
    }

    /**
     * Toggle mute all sounds
     */
    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.isMuted && this.bgm) {
            this.bgm.pause();
        } else if (!this.isMuted && this.bgm) {
            this.bgm.play().catch(() => { });
        }
        return this.isMuted;
    }

    /**
     * Toggle BGM mute
     */
    toggleBgmMute() {
        this.isBgmMuted = !this.isBgmMuted;
        if (this.isBgmMuted && this.bgm) {
            this.bgm.pause();
        } else if (!this.isBgmMuted && this.bgm) {
            this.bgm.play().catch(() => { });
        }
        return this.isBgmMuted;
    }

    /**
     * Toggle SFX mute
     */
    toggleSfxMute() {
        this.isSfxMuted = !this.isSfxMuted;
        return this.isSfxMuted;
    }

    /**
     * Set BGM Volume (0-1)
     */
    setBgmVolume(volume) {
        this.bgmVolume = Math.max(0, Math.min(1, volume));
        if (this.bgm) {
            this.bgm.volume = this.bgmVolume;
        }
    }

    /**
     * Set SFX Volume (0-1)
     */
    setSfxVolume(volume) {
        this.sfxVolume = Math.max(0, Math.min(1, volume));
    }

    /**
     * Get current mute states
     */
    getMuteStates() {
        return {
            isMuted: this.isMuted,
            isBgmMuted: this.isBgmMuted,
            isSfxMuted: this.isSfxMuted,
            bgmVolume: this.bgmVolume,
            sfxVolume: this.sfxVolume
        };
    }
}

// Singleton export
export const SoundManager = new SoundManagerClass();
