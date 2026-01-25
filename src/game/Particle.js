export class Particle {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type; // 'blood', 'spark', 'dust'
        this.alive = true;

        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 5 + 2;

        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;

        if (type === 'dust') {
            this.vy = -Math.random() * 3 - 1; // float up
            this.vx = (Math.random() - 0.5) * 2;
            this.gravity = -0.05;
            this.size = Math.random() * 20 + 10;
            this.life = 60;
            this.color = `rgba(200, 200, 200, ${Math.random() * 0.5})`;
        } else if (type === 'blood') {
            this.gravity = 0.5;
            this.size = Math.random() * 6 + 2;
            this.life = 100;
            this.color = '#ff0000';
        } else if (type === 'spark') {
            this.gravity = 0.2;
            this.size = Math.random() * 4 + 2;
            this.life = 30;
            this.color = '#ffff00';
            // Sparks fly away from impact
        }

        this.currentLife = this.life;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += this.gravity;

        this.currentLife--;
        if (this.currentLife <= 0) this.alive = false;

        if (this.type === 'blood' && this.y > 450) { // Hit ground
            this.y = 450;
            this.vx *= 0.8;
            this.vy = 0;
            this.gravity = 0;
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.currentLife / this.life;
        ctx.fillStyle = this.color;

        if (this.type === 'dust') {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        } else {
            ctx.fillRect(this.x, this.y, this.size, this.size);
        }

        ctx.restore();
    }
}
