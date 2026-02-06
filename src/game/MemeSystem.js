export class MemeSystem {
    constructor() {
        this.texts = [];
    }

    spawn(x, y, text, isSpecial = false) {
        this.texts.push({
            x: x + (Math.random() * 40 - 20),
            y: y + (Math.random() * 40 - 20),
            text,
            isSpecial,
            life: 1.0, // 0 to 1
            velocity: {
                x: (Math.random() - 0.5) * 2,
                y: -2 - Math.random() * 2
            },
            scale: isSpecial ? 1.5 : 1,
            color: isSpecial ? '#FFD700' : '#FFFFFF' // Gold for special, White for normal
        });
    }

    update(deltaTime) {
        this.texts.forEach(text => {
            text.x += text.velocity.x;
            text.y += text.velocity.y;
            text.life -= deltaTime / 1000; // Fade out over 1 second

            if (text.isSpecial) {
                text.scale = 1.5 + Math.sin(Date.now() / 50) * 0.2; // Pulse effect
            }
        });

        this.texts = this.texts.filter(text => text.life > 0);
    }

    draw(ctx) {
        t
        ctx.save();
        this.texts.forEach(text => {
            ctx.globalAlpha = Math.max(0, text.life);
            ctx.font = `900 ${text.isSpecial ? "40px" : "24px"} "Comic Sans MS", "Chalkboard SE", sans-serif`;
            ctx.textAlign = "center";

            // Stroke
            ctx.lineWidth = 4;
            ctx.strokeStyle = "black";
            ctx.strokeText(text.text, text.x, text.y);

            // Fill
            ctx.fillStyle = text.color;
            ctx.fillText(text.text, text.x, text.y);
        });
        ctx.restore();
    }
}
