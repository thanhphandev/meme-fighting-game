import { CONFIG, CHARACTERS } from './constants';

export class Fighter {
    constructor(ctx, x, characterId, isAI = false) {
        this.ctx = ctx;
        this.characterId = characterId;
        this.charData = CHARACTERS.find(c => c.id === characterId);

        this.width = 256;
        this.height = 256;
        this.x = x;
        this.y = CONFIG.canvasHeight - this.height - CONFIG.groundY;
        this.isAI = isAI;

        this.image = new Image();
        this.image.src = `/assets/${this.charData.asset}`;

        this.spriteWidth = 0;
        this.spriteHeight = 0;
        // Assume 6x8 layout as per standard
        this.cols = 6;
        this.rows = 8;

        this.image.onload = () => {
            this.spriteWidth = this.image.width / this.cols;
            this.spriteHeight = this.image.height / this.rows;
        };

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

        // Dynamic Hitbox centered in 256 frame
        const hbW = 70;
        const hbH = 110;
        this.hitbox = { width: hbW, height: hbH, x: 0, y: 0 }; // x,y updated in update()

        // Attack box wider
        this.attackBox = { x: 0, y: 0, width: 140, height: 80 };
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
        if (this.isDead || (this.state === 'hit' && this.frameX < 5)) return;
        this.input = input;
    }

    update(deltaTime, opponent, onHit, spawnParticle) {
        this.hitStunTimer = Math.max(0, this.hitStunTimer - deltaTime);

        // Update Blocking Status
        this.isBlocking = false;
        if (!this.isDead && (this.state === 'idle' || this.state === 'run')) {
            if (this.facingRight && this.input.left) this.isBlocking = true;
            else if (!this.facingRight && this.input.right) this.isBlocking = true;
        }

        // Hit Stun Freeze
        if (this.hitStunTimer > 0) {
            // Apply friction even during stun
            this.x += this.velocityX;
            this.y += this.velocityY;
            this.velocityX *= CONFIG.friction;
            if (this.y + this.height < CONFIG.canvasHeight - CONFIG.groundY) {
                this.velocityY += CONFIG.gravity;
            } else {
                this.y = CONFIG.canvasHeight - this.height - CONFIG.groundY;
                this.velocityY = 0;
            }
            // Allow 'hit' animation update
            if (this.state === 'hit') this.updateAnimation(deltaTime, true);
            return;
        }

        if (this.isDead) {
            this.setState('ko');
            this.updateAnimation(deltaTime, true);
            return;
        }

        // Particles on movement (Dust)
        if (this.onGround && Math.abs(this.velocityX) > 5 && Math.random() < 0.2 && spawnParticle) {
            spawnParticle(this.x + this.width / 2, this.y + this.height, 'dust');
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

        this.velocityX *= CONFIG.friction;

        // Update Hitbox Position
        this.hitbox.x = this.x + (this.width - this.hitbox.width) / 2;
        this.hitbox.y = this.y + (this.height - this.hitbox.height);

        // Update Attackbox Position
        const centerX = this.x + this.width / 2;
        this.attackBox.x = this.facingRight ? centerX : centerX - this.attackBox.width;
        this.attackBox.y = this.hitbox.y + 20;

        // State Machine
        if (this.state === 'hit' || this.state === 'attack' || this.state === 'skill') {
            // Busy
        } else if (this.state === 'roll') {
            const speed = this.charData.stats.speed;
            this.velocityX = this.facingRight ? speed * 3 : -speed * 3;
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

        const stopAnim = this.state === 'jump' || this.state === 'fall';
        const layout = this.updateAnimation(deltaTime, stopAnim);

        if (this.state === 'hit' && layout) {
            this.setState('idle');
        } else if (this.state === 'attack') {
            if (this.frameX === 3) this.checkAttackCollision(opponent, onHit, spawnParticle);
            if (layout) this.setState('idle');
        } else if (this.state === 'skill') {
            this.handleSkillUpdate(deltaTime, opponent, onHit);
            if (layout && this.skillActiveTimer <= 0) this.setState('idle');
        } else if (this.state === 'roll') {
            const speed = this.charData.stats.speed;
            this.velocityX = this.facingRight ? speed * 3 : -speed * 3;
            if (layout) this.setState('idle');
        }
    }

    checkAttackCollision(opponent, onHit, spawnParticle) {
        if (opponent.isDead || opponent.state === 'roll') return;

        if (this.attackBox.x < opponent.hitbox.x + opponent.hitbox.width &&
            this.attackBox.x + this.attackBox.width > opponent.hitbox.x &&
            this.attackBox.y < opponent.hitbox.y + opponent.hitbox.height &&
            this.attackBox.y + this.attackBox.height > opponent.hitbox.y) {

            // Calculate impact direction
            const direction = this.facingRight ? 1 : -1;
            opponent.takeDamage(this.charData.stats.damage, direction, spawnParticle);
            onHit(opponent.x + opponent.width / 2, opponent.y);
        }
    }

    takeDamage(amount, direction, spawnParticle) {
        if (this.isInvincible || this.state === 'roll') return;

        if (this.isBlocking) {
            // Blocked hit
            this.health -= amount * (1 - CONFIG.blockReduction);
            this.velocityX = direction * CONFIG.knockbackForce * 0.5; // Pushback on block
            this.hitStunTimer = 100; // Short stun on block
            if (spawnParticle) spawnParticle(this.hitbox.x + this.hitbox.width / 2, this.hitbox.y + 20, 'spark');
        } else {
            // Clean hit
            this.health -= amount;
            this.hitStunTimer = CONFIG.hitStun;
            this.velocityX = direction * CONFIG.knockbackForce;

            if (this.health <= 0) {
                this.health = 0;
                this.isDead = true;
            } else {
                this.setState('hit');
                // this.scale is handled by breathe effect mostly, maybe skip shake here?
            }
            if (spawnParticle) {
                // Spawn multiple blood particles
                for (let i = 0; i < 5; i++) spawnParticle(this.hitbox.x + this.hitbox.width / 2, this.hitbox.y + 40, 'blood');
            }
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
        let cycleCompleted = false;
        // Hardcoded 24 FPS for animation consistency (approx 41ms per frame)
        // regardless of game logic FPS
        const animInterval = 1000 / 24;

        if (this.frameTimer > animInterval) {
            if (this.frameX < 5) {
                this.frameX++;
            } else if (!stopAtEnd) {
                this.frameX = 0;
                cycleCompleted = true;
            }
            this.frameTimer = 0;
        } else {
            this.frameTimer += deltaTime;
        }
        return cycleCompleted;
    }

    draw() {
        if (this.spriteWidth === 0 || this.spriteHeight === 0) return;

        this.ctx.save();
        // Shadow
        this.ctx.fillStyle = 'rgba(0,0,0,0.3)';
        this.ctx.beginPath();
        this.ctx.ellipse(
            Math.floor(this.x + this.width / 2),
            Math.floor(CONFIG.canvasHeight - CONFIG.groundY),
            50, 15, 0, 0, Math.PI * 2
        );
        this.ctx.fill();

        // Round all coordinates to avoid anti-aliasing blur
        const drawX = Math.floor(this.x);
        const drawY = Math.floor(this.y);
        const drawW = Math.floor(this.width * this.scale);
        const drawH = Math.floor(this.height * this.scale);

        // Offset Y for breathing scale effect
        const offsetY = Math.floor(this.height * (this.scale - 1));

        const srcX = Math.floor(this.frameX * this.spriteWidth);
        const srcY = Math.floor(this.frameY * this.spriteHeight);
        const srcW = Math.floor(this.spriteWidth);
        const srcH = Math.floor(this.spriteHeight);

        if (this.facingRight) {
            this.ctx.drawImage(
                this.image,
                srcX, srcY, srcW, srcH,
                drawX, drawY - offsetY, drawW, drawH
            );
        } else {
            this.ctx.translate(drawX + this.width, drawY);
            this.ctx.scale(-1, 1);
            this.ctx.drawImage(
                this.image,
                srcX, srcY, srcW, srcH,
                0, -offsetY, drawW, drawH
            );
        }
        this.ctx.restore();
    }
}
