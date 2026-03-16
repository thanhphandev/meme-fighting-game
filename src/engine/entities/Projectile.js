import { CONFIG } from '../data/constants';

export class Projectile {
    constructor(x, y, facingRight, ownerId, config) {
        this.x = x;
        this.y = y;
        this.facingRight = facingRight;
        this.ownerId = ownerId;
        this.config = config;

        // Physics
        this.vx = facingRight ? (config.speedX || 10) : -(config.speedX || 10);
        this.vy = config.speedY || 0;
        this.gravity = config.gravity || 0;
        this.friction = config.friction || 1;

        // Dimensions
        this.width = config.width || 30;
        this.height = config.height || 30;

        // Lifecycle
        this.life = config.life || 100;
        this.alive = true;
        this.hasHit = false;
    }

    update(deltaTime) {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += this.gravity;
        this.vx *= this.friction;

        this.life--;
        if (this.life <= 0) this.alive = false;

        // Ground Interaction
        const groundLevel = CONFIG.canvasHeight - CONFIG.groundY - this.height;
        if (this.y > groundLevel) {
            this.y = groundLevel;
            if (this.config.onGround === 'bounce') {
                this.vy *= -0.6;
                this.vx *= 0.8;
                if (Math.abs(this.vy) < 1) this.vy = 0;
            } else if (this.config.onGround === 'stop') {
                this.vx = 0;
                this.vy = 0;
                this.gravity = 0;
            } else {
                // Destroy
                this.alive = false;
            }
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.fillStyle = this.config.color || '#fff';

        // Simple shape rendering for now. 
        // In a real optimized system, this would refer to an image in ResourceManager too
        if (this.config.shape === 'circle') {
            ctx.beginPath();
            ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 2, 0, Math.PI * 2);
            ctx.fill();
        } else {
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }

        // Trail effect hint
        ctx.globalAlpha = 0.3;
        ctx.fillRect(this.x - this.vx, this.y - this.vy, this.width, this.height);
        ctx.restore();
    }
}
