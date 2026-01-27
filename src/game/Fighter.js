import { CONFIG, CHARACTERS } from './constants';

export class Fighter {
    constructor(ctx, x, characterId, isAI = false, image = null, facingRight = true) {
        this.ctx = ctx;
        this.characterId = characterId;
        this.charData = CHARACTERS.find(c => c.id === characterId);

        this.width = 256;
        this.height = 256;
        this.x = x;
        this.y = CONFIG.canvasHeight - this.height - CONFIG.groundY;
        this.isAI = isAI;

        // Use preloaded image if available, else fallback (legacy support)
        if (image) {
            this.image = image;
            this.spriteWidth = this.image.width / 6; // Assume 6 cols
            this.spriteHeight = this.image.height / 8; // Assume 8 rows
        } else {
            this.image = new Image();
            this.image.src = `/assets/${this.charData.asset}`;
            this.image.onload = () => {
                this.spriteWidth = this.image.width / 6;
                this.spriteHeight = this.image.height / 8;
            };
        }

        this.cols = 6;
        this.rows = 8;

        this.frameX = 0;
        this.frameY = 0;
        this.frameTimer = 0;
        this.frameInterval = 1000 / CONFIG.fps;

        this.velocityX = 0;
        this.velocityY = 0;
        this.onGround = true;
        this.facingRight = (typeof facingRight !== 'undefined') ? facingRight : !isAI;

        this.health = CONFIG.baseHp;
        this.stamina = 100;
        this.isDead = false;
        this.state = 'idle';
        this.maxFrames = 6; // Initial default

        // Dynamic Hitbox centered in 256 frame
        const hbConfig = this.charData.hitbox || CONFIG.defaultHitbox;
        const hbW = hbConfig.width;
        const hbH = hbConfig.height;
        this.hitbox = { width: hbW, height: hbH, x: 0, y: 0 }; // x,y updated in update()

        // Attack box wider
        const abConfig = this.charData.attackBox || CONFIG.defaultAttackBox;
        this.attackBox = { x: 0, y: 0, width: abConfig.width, height: abConfig.height };
        this.input = { left: false, right: false, up: false, attack: false, roll: false, skill: false };

        this.skillCooldown = 0;
        this.skillActiveTimer = 0;
        this.isInvincible = false;
        this.scale = 1;

        this.hitStunTimer = 0;
        this.hasHit = false;

        // Input Buffer
        this.inputBuffer = null;
        this.bufferTimer = 0;
        this.bufferWindow = 150; // ms to buffer input
    }

    setState(stateName) {
        if (this.state === stateName) return;
        this.state = stateName;
        this.frameY = this.charData.rows[stateName] || 0;
        this.frameX = 0;
        this.maxFrames = this.charData.frameCounts ? (this.charData.frameCounts[stateName] || 6) : 6;
        this.hasHit = false;
    }

    setVictory() {
        // Use 'skill' frame for victory pose as it usually looks cool/action-oriented
        this.setState('skill');
        this.isInvincible = true;
    }

    handleInput(input) {
        if (this.isDead) return;

        // Always update holding inputs (move)
        this.input = input;

        // Buffer trigger inputs (attack/roll/skill/jump)
        if (input.attack || input.roll || input.skill || input.up) {
            this.inputBuffer = { ...input };
            this.bufferTimer = this.bufferWindow;
        }
    }

    update(deltaTime, opponent, onHit, spawnParticle, spawnProjectile) {
        // Update Buffer Timer
        if (this.bufferTimer > 0) this.bufferTimer -= deltaTime;
        if (this.bufferTimer <= 0) this.inputBuffer = null;

        // Ensure timer is valid number
        let currentStun = this.hitStunTimer || 0;
        this.hitStunTimer = Math.max(0, currentStun - deltaTime);

        // Update Blocking Status
        this.isBlocking = false;
        if (!this.isDead && (this.state === 'idle' || this.state === 'run')) {
            if (this.facingRight && this.input.left) this.isBlocking = true;
            else if (!this.facingRight && this.input.right) this.isBlocking = true;
        }

        // Hit Stun Freeze... (keeping existing)
        if (this.hitStunTimer > 0) {
            this.x += this.velocityX;
            this.y += this.velocityY;
            this.velocityX *= CONFIG.friction;
            if (this.y + this.height < CONFIG.canvasHeight - CONFIG.groundY) {
                this.velocityY += CONFIG.gravity;
            } else {
                this.y = CONFIG.canvasHeight - this.height - CONFIG.groundY;
                this.velocityY = 0;
            }
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

        // Friction / Air Resistance
        if (this.onGround) {
            this.velocityX *= CONFIG.friction;
        } else {
            this.velocityX *= CONFIG.airResistance; // slightly more slippery in air (0.98 vs 0.85)
        }

        // Update Hitbox Position
        this.hitbox.x = this.x + (this.width - this.hitbox.width) / 2;
        this.hitbox.y = this.y + (this.height - this.hitbox.height);

        // Update Attackbox Position
        const centerX = this.x + this.width / 2;
        this.attackBox.x = this.facingRight ? centerX : centerX - this.attackBox.width;
        this.attackBox.y = this.hitbox.y + 20;

        // State Machine & Input Consumption
        // Helper to consume buffer
        const tryAction = () => {
            // Prefer buffer, else current held input
            const activeInput = this.inputBuffer || this.input;

            if (activeInput.skill && this.stamina >= CONFIG.skillCost && this.skillCooldown <= 0) {
                this.useSkill(onHit, spawnProjectile);
                this.inputBuffer = null;
                return true;
            } else if (activeInput.attack && this.stamina >= CONFIG.attackCost) {
                this.setState('attack');
                this.stamina -= CONFIG.attackCost;
                this.inputBuffer = null;
                return true;
            } else if (activeInput.roll && this.stamina >= CONFIG.dashCost) {
                this.setState('roll');
                this.stamina -= CONFIG.dashCost;
                this.inputBuffer = null;
                return true;
            } else if (activeInput.up && this.onGround) {
                this.velocityY = -this.charData.stats.jump;
                this.setState('jump');
                this.inputBuffer = null; // Consume jump
                return true;
            }
            return false;
        };

        if (this.state === 'hit' || this.state === 'attack' || this.state === 'skill') {
            // Busy - do nothing, input is buffered
        } else if (this.state === 'roll') {
            const speed = this.charData.stats.speed;
            this.velocityX = this.facingRight ? speed * 3 : -speed * 3;
        } else {
            // Idle/Run/Jump/Fall - Can act inside here
            if (tryAction()) {
                // Action taken
            } else if (!this.onGround) {
                this.setState(this.velocityY > 0 ? 'fall' : 'jump');
                // Air control (nerfed)
                if (this.input.right) this.velocityX += 0.5;
                if (this.input.left) this.velocityX -= 0.5;
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

        // Remove Buffs when timer ends
        if (this.skillActiveTimer <= 0 && this.state !== 'skill') {
            this.scale = 1;
            this.isInvincible = false;
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
        if (opponent.isDead || opponent.state === 'roll' || this.hasHit) return;

        if (this.attackBox.x < opponent.hitbox.x + opponent.hitbox.width &&
            this.attackBox.x + this.attackBox.width > opponent.hitbox.x &&
            this.attackBox.y < opponent.hitbox.y + opponent.hitbox.height &&
            this.attackBox.y + this.attackBox.height > opponent.hitbox.y) {

            // Calculate impact direction
            const direction = this.facingRight ? 1 : -1;
            opponent.takeDamage(this.charData.stats.damage, direction, spawnParticle);
            this.hasHit = true;
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

    useSkill(onHit, spawnProjectile) {
        this.stamina -= CONFIG.skillCost;
        this.skillCooldown = CONFIG.skillCooldown;
        this.setState('skill');

        const skill = this.charData.skill;
        const config = skill.data || {};

        if (skill.type === 'projectile') {
            // Spawn project at offset
            const spawnX = this.x + (this.facingRight ? this.width * 0.8 : this.width * 0.2);
            const spawnY = this.y + this.height * 0.5;
            if (spawnProjectile) {
                spawnProjectile(spawnX, spawnY, this.facingRight, this.characterId, config);
            }
            this.skillActiveTimer = 300; // Casting lock
        }
        else if (skill.type === 'buff') {
            this.skillActiveTimer = config.duration || 500;
            onHit(this.x + this.width / 2, this.y, true, skill.name);
        }
        else if (skill.type === 'aoe') {
            this.skillActiveTimer = config.duration || 100;
            onHit(this.x + this.width / 2, this.y, true, skill.name);
        }
        else if (skill.type === 'dash') {
            this.skillActiveTimer = 300;
            this.isInvincible = config.invuln || false;
            this.velocityX = this.facingRight ? (config.speed || 30) : -(config.speed || 30);
        }
        else {
            // Fallback for generic or unknown
            this.skillActiveTimer = 800;
            this.isInvincible = true;
            onHit(this.x + this.width / 2, this.y, true, skill.name);
        }
    }

    handleSkillUpdate(deltaTime, opponent, onHit) {
        const skill = this.charData.skill;
        const config = skill.data || {};

        if (skill.type === 'buff') {
            // Example general buffs
            if (config.scale) this.scale = 1 + (config.scale - 1) * Math.sin(Date.now() / 100);
        }
        else if (skill.type === 'aoe') {
            // Tick damage
            if (this.skillActiveTimer % (config.interval || 20) < 15) {
                const range = config.range || 200;
                const dist = Math.abs((this.x + this.width / 2) - (opponent.x + opponent.width / 2));
                if (dist < range) {
                    opponent.takeDamage(config.damage || 1, this.facingRight ? 1 : -1, null);
                }
            }
            if (config.visual === 'shake' || config.visual === 'water' || config.visual === 'ripple') {
                this.x += (Math.random() - 0.5) * 5;
            }
        }
        else if (skill.type === 'dash') {
            this.checkAttackCollision(opponent, onHit);
        }
    }

    updateAnimation(deltaTime, stopAtEnd = false) {
        let cycleCompleted = false;
        // Frame counts per row (default to 6 if not specified)
        this.maxFrames = this.charData.frameCounts ? (this.charData.frameCounts[this.state] || 6) : 6;

        // Dynamic FPS calculation for smoother feel
        let fps = 10; // Default base

        switch (this.state) {
            case 'idle':
                fps = 8; // Slower "breathing" feel
                break;
            case 'run':
                // Sync animation capability with movement speed
                // Base 10 + speed factor. Maximum ~20fps for running.
                fps = 10 + Math.abs(this.velocityX);
                break;
            case 'jump':
            case 'fall':
                fps = 12;
                break;
            case 'attack':
                fps = 20; // Snappy attacks
                break;
            case 'skill':
                fps = 15; // Clearly visible casting
                break;
            case 'hit':
                fps = 12;
                break;
            case 'roll':
                fps = 24; // Fast roll
                break;
            case 'ko':
                fps = 5;
                stopAtEnd = true; // Ensure KO doesn't loop
                break;
        }

        const animInterval = 1000 / fps;

        if (this.frameTimer > animInterval) {
            if (this.frameX < this.maxFrames - 1) {
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
