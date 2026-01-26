export class AI {
    constructor(fighter) {
        this.fighter = fighter;
        this.decisionTimer = 0;
        this.decisionInterval = 250;
        this.input = { left: false, right: false, up: false, attack: false, roll: false };
    }

    update(deltaTime, opponent) {
        this.decisionTimer += deltaTime;
        if (this.decisionTimer > this.decisionInterval) {
            this.decisionTimer = 0;
            this.makeDecision(opponent);
        }
        this.fighter.handleInput(this.input);
    }

    makeDecision(opponent) {
        const dx = (opponent.x + opponent.width / 2) - (this.fighter.x + this.fighter.width / 2);
        const dist = Math.abs(dx);
        this.input = { left: false, right: false, up: false, attack: false, roll: false, skill: false };

        if (opponent.isDead) return;

        // Defensive Logic (Block if opponent attacking)
        if (opponent.state === 'attack' && dist < 250 && Math.random() < 0.25) { // Nerfed block chance 0.7 -> 0.25
            // Block by moving away
            if (dx > 0) this.input.left = true;
            else this.input.right = true;
            return;
        }

        if (dist > 150) {
            // Chase
            if (dx > 0) this.input.right = true;
            else this.input.left = true;

            // Long range skill
            if (dist > 300 && Math.random() < 0.02) this.input.skill = true; // Nerfed skill freq
        } else {
            // Melee
            if (Math.random() < 0.25) this.input.attack = true; // Nerfed aggression 0.6 -> 0.25
            else if (Math.random() < 0.05) this.input.skill = true;
            else if (Math.random() < 0.05) this.input.roll = true;
            else if (dx > 0) this.input.right = true; // Face opponent
            else this.input.left = true;
        }

        if (Math.random() < 0.02) this.input.up = true;
    }
}
