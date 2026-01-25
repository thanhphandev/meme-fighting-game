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
        this.input = { left: false, right: false, up: false, attack: false, roll: false };

        if (opponent.isDead) return;

        if (dist > 180) {
            if (dx > 0) this.input.right = true;
            else this.input.left = true;
        } else {
            if (Math.random() < 0.3) this.input.attack = true;
            else if (Math.random() < 0.1) this.input.skill = true;
            else if (Math.random() < 0.1) this.input.roll = true;
            else if (dx > 0) this.input.left = true;
            else this.input.right = true;
        }
        if (Math.random() < 0.05) this.input.up = true;
    }
}
