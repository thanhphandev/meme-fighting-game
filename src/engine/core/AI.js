export class AI {
    constructor(fighter, difficulty = 'medium') {
        this.fighter = fighter;
        this.difficulty = difficulty;
        this.decisionTimer = 0;

        // Difficulty Tuning
        switch (difficulty) {
            case 'easy':
                this.decisionInterval = 400; // Slow reaction
                this.aggression = 0.1;
                this.blockChance = 0.1;
                this.skillChance = 0.01;
                break;
            case 'hard':
                this.decisionInterval = 100; // Fast reaction
                this.aggression = 0.6;
                this.blockChance = 0.8;
                this.skillChance = 0.1;
                break;
            case 'medium':
            default:
                this.decisionInterval = 250;
                this.aggression = 0.3;
                this.blockChance = 0.4;
                this.skillChance = 0.05;
                break;
        }

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
        if (opponent.state === 'attack' && dist < 250 && Math.random() < this.blockChance) {
            // Block by moving away or rolling (Hard only)
            if (this.difficulty === 'hard' && Math.random() < 0.3) {
                this.input.roll = true;
            } else {
                if (dx > 0) this.input.left = true;
                else this.input.right = true;
            }
            return;
        }

        if (dist > 150) {
            // Chase
            if (dx > 0) this.input.right = true;
            else this.input.left = true;

            // Long range skill
            if (dist > 300 && Math.random() < this.skillChance) this.input.skill = true;
        } else {
            // Melee
            if (Math.random() < this.aggression) this.input.attack = true;
            else if (Math.random() < this.skillChance) this.input.skill = true;
            else if (Math.random() < 0.05) this.input.roll = true;
            else if (dx > 0) this.input.right = true; // Face opponent
            else this.input.left = true;
        }

        // Jump occasionally
        if (Math.random() < (this.difficulty === 'hard' ? 0.05 : 0.02)) this.input.up = true;
    }
}
