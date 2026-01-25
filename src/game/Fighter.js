import { CONFIG, CHARACTERS } from './constants';

export class Fighter {
    constructor(ctx, x, characterId, isAI = false) {
        this.ctx = ctx;
        this.characterId = characterId;
        this.charData = CHARACTERS.find(c => c.id === characterId);

        this.width = 180;
        this.height = 180;
        this.x = x;
        this.y = CONFIG.canvasHeight - this.height - CONFIG.groundY;
        this.isAI = isAI;

        this.image = new Image();
        this.image.src = `/assets/${this.charData.asset}`;

        this.frameX = 0;
        this.frameY = 0;
        this.frameTimer = 0;
        this.frameInterval = 1000 / CONFIG.fps;

        this.velocityX = 0;
        this.velocityY = 0;
        this.onGround = true;
        this.facingRight = !isAI;

        this.health = CONFIG.baseHp;
        this.stamina = 100;
        this.isDead = false;
        this.state = 'idle';

        this.hitbox = { x: 0, y: 0, width: 70, height: 110 };
        this.attackBox = { x: 0, y: 0, width: 100, height: 60 };
        this.input = { left: false, right: false, up: false, attack: false, roll: false, skill: false };

        this.skillCooldown = 0;
        this.skillActiveTimer = 0;
        this.isInvincible = false;
        this.scale = 1;
    }

    setState(stateName) {
        if (this.state === stateName) return;
        this.state = stateName;
        this.frameY = this.charData.rows[stateName] || 0;
        this.frameX = 0;
    }

    handleInput(input) {
        if (this.isDead || (this.state === 'hit' && this.frameX < 3)) return;
        this.input = input;
    }

    update(deltaTime, opponent, onHit) {
        if (this.isDead) {
            this.setState('ko');
            this.updateAnimation(deltaTime, true);
            return;
        }

        this.x += this.velocityX;
        this.y += this.velocityY;

        // Gravity
        if (this.y + this.height < CONFIG.canvasHeight - CONFIG.groundY) {
            this.velocityY += CONFIG.gravity;
            this.onGround = false;
        } else {
            this.y = CONFIG.canvasHeight - this.height - CONFIG.groundY;
            this.velocityY = 0;
            this.onGround = true;
        }

        this.velocityX *= 0.85;

        // State Machine
        if (this.state === 'hit') {
            if (this.frameX >= 3) this.setState('idle');
        } else if (this.state === 'attack') {
            if (this.frameX === 2) this.checkAttackCollision(opponent, onHit);
            if (this.frameX >= 3) this.setState('idle');
        } else if (this.state === 'skill') {
            this.handleSkillUpdate(deltaTime, opponent, onHit);
            if (this.frameX >= 3 && this.skillActiveTimer <= 0) this.setState('idle');
        } else if (this.state === 'roll') {
            const speed = this.charData.stats.speed;
            this.velocityX = this.facingRight ? speed * 3 : -speed * 3;
            if (this.frameX >= 3) this.setState('idle');
        } else {
            if (this.input.skill && this.stamina >= CONFIG.skillCost && this.skillCooldown <= 0) {
                this.useSkill(onHit);
            } else if (this.input.attack && this.stamina >= CONFIG.attackCost) {
                this.setState('attack');
                this.stamina -= CONFIG.attackCost;
            } else if (this.input.roll && this.stamina >= CONFIG.dashCost) {
                this.setState('roll');
                this.stamina -= CONFIG.dashCost;
            } else if (this.input.up && this.onGround) {
                this.velocityY = -this.charData.stats.jump;
                this.setState('jump');
            } else if (!this.onGround) {
                this.setState(this.velocityY > 0 ? 'fall' : 'jump');
            } else if (this.input.right) {
                this.velocityX = this.charData.stats.speed;
                this.facingRight = true;
                this.setState('run');
            } else if (this.input.left) {
                this.velocityX = -this.charData.stats.speed;
                this.facingRight = false;
                this.setState('run');
            } else {
                this.setState('idle');
            }
        }

        if (this.stamina < 100) this.stamina += 0.8;
        if (this.skillCooldown > 0) this.skillCooldown -= deltaTime;
        if (this.skillActiveTimer > 0) this.skillActiveTimer -= deltaTime;
        else {
            this.isInvincible = false;
            this.scale = 1;
        }

        if (this.x < 0) this.x = 0;
        if (this.x > CONFIG.canvasWidth - this.width) this.x = CONFIG.canvasWidth - this.width;

        this.hitbox.x = this.x + 55;
        this.hitbox.y = this.y + 40;
        this.attackBox.x = this.facingRight ? this.hitbox.x + 30 : this.hitbox.x - 70;
        this.attackBox.y = this.hitbox.y + 20;

        this.updateAnimation(deltaTime);
    }

    checkAttackCollision(opponent, onHit) {
        if (opponent.isDead || opponent.state === 'roll') return;

        if (this.attackBox.x < opponent.hitbox.x + opponent.hitbox.width &&
            this.attackBox.x + this.attackBox.width > opponent.hitbox.x &&
            this.attackBox.y < opponent.hitbox.y + opponent.hitbox.height &&
            this.attackBox.y + this.attackBox.height > opponent.hitbox.y) {

            opponent.takeDamage(this.charData.stats.damage);
            onHit(opponent.x + opponent.width / 2, opponent.y);
        }
    }

    takeDamage(amount) {
        if (this.isInvincible || this.state === 'roll') return;
        this.health -= amount;
        if (this.health <= 0) {
            this.health = 0;
            this.isDead = true;
        } else {
            this.setState('hit');
            this.velocityX = this.facingRight ? -15 : 15;
            this.scale = 0.8;
            setTimeout(() => this.scale = 1, 200);
        }
    }

    useSkill(onHit) {
        this.stamina -= CONFIG.skillCost;
        this.skillCooldown = CONFIG.skillCooldown;
        this.setState('skill');

        const skillType = this.charData.skill.type;
        if (skillType === 'buff') {
            this.skillActiveTimer = 2000;
            this.velocityX = this.facingRight ? 25 : -25;
        } else if (skillType === 'slam') {
            this.skillActiveTimer = 500;
            this.velocityY = 20;
        } else if (skillType === 'projectile' || skillType === 'dash') {
            this.skillActiveTimer = 800;
            this.isInvincible = true;
        }

        // Visual feedback
        onHit(this.x + this.width / 2, this.y, true); // True means special meme text
    }

    handleSkillUpdate(deltaTime, opponent, onHit) {
        const skillType = this.charData.skill.type;
        if (skillType === 'buff') {
            this.scale = 1 + Math.sin(Date.now() / 50) * 0.3;
            this.velocityX *= 1.1;
            this.checkAttackCollision(opponent, onHit);
        } else if (skillType === 'slam') {
            if (this.onGround) {
                this.checkAttackCollision(opponent, onHit);
                this.scale = 1.5;
            }
        } else if (skillType === 'dash' || skillType === 'projectile') {
            this.velocityX = this.facingRight ? 30 : -30;
            this.checkAttackCollision(opponent, onHit);
        }
    }

    updateAnimation(deltaTime, stopAtEnd = false) {
        if (this.frameTimer > this.frameInterval) {
            if (this.frameX < 3) {
                this.frameX++;
            } else if (!stopAtEnd) {
                this.frameX = 0;
            }
            this.frameTimer = 0;
        } else {
            this.frameTimer += deltaTime;
        }
    }

    draw() {
        this.ctx.save();
        // Shadow
        this.ctx.fillStyle = 'rgba(0,0,0,0.3)';
        this.ctx.beginPath();
        this.ctx.ellipse(this.x + this.width / 2, CONFIG.canvasHeight - CONFIG.groundY, 50, 15, 0, 0, Math.PI * 2);
        this.ctx.fill();

        if (this.facingRight) {
            this.ctx.drawImage(this.image, this.frameX * 256, this.frameY * 256, 256, 256, this.x, this.y - (this.height * (this.scale - 1)), this.width * this.scale, this.height * this.scale);
        } else {
            this.ctx.translate(this.x + this.width, this.y);
            this.ctx.scale(-1, 1);
            this.ctx.drawImage(this.image, this.frameX * 256, this.frameY * 256, 256, 256, 0, -(this.height * (this.scale - 1)), this.width * this.scale, this.height * this.scale);
        }
        this.ctx.restore();
    }
}
