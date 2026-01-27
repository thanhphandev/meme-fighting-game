export const CONFIG = {
    canvasWidth: 1000,
    canvasHeight: 500,
    gravity: 0.8,
    groundY: 60,
    fps: 60,
    baseHp: 500, // Revert to reasonable HP for longer fights
    baseDamage: 20, // Increased base damage

    // Physics
    friction: 0.85,
    airResistance: 0.98,

    // Combat
    hitStun: 400, // ms
    knockbackForce: 15,
    blockReduction: 0.8, // 80% damage reduction

    defaultHitbox: { width: 70, height: 110 },
    defaultAttackBox: { width: 140, height: 80 },

    // Resources
    dashCost: 35,
    attackCost: 10,
    skillCost: 50,
    skillCooldown: 5000,
};

export const CHARACTERS = [
    {
        id: 'doge',
        name: 'Lil Doge',
        asset: 'doge.png',
        description: 'Much speed. Wow.',
        stats: { speed: 9, jump: 18, damage: 12 },
        rows: { idle: 0, run: 1, jump: 2, fall: 3, attack: 4, skill: 5, hit: 6, ko: 7, roll: 1 },
        frameCounts: { idle: 4, run: 6, jump: 4, fall: 4, attack: 5, skill: 6, hit: 3, ko: 1, roll: 6 },
        skill: {
            name: 'MUCH SPEED',
            type: 'buff',
            data: { speedMult: 1.5, duration: 200 } // Frames 
        }
    },
    {
        id: 'buff_doge',
        name: 'Muscular Doge',
        asset: 'buff_doge.png',
        description: 'The ultimate absolute unit.',
        stats: { speed: 6, jump: 15, damage: 20 },
        rows: { idle: 0, run: 1, jump: 2, fall: 3, attack: 4, skill: 5, hit: 6, ko: 7, roll: 1 },
        frameCounts: { idle: 4, run: 6, jump: 4, fall: 4, attack: 6, skill: 6, hit: 3, ko: 1, roll: 6 },
        skill: {
            name: 'ABSOLUTE UNIT',
            type: 'buff',
            data: { scale: 1.5, damageMult: 1.5, duration: 120 }
        }
    },
    {
        id: 'pepe',
        name: 'Feels Good Pepe',
        asset: 'pepe.png',
        description: 'It is what it is.',
        stats: { speed: 8, jump: 20, damage: 15 },
        rows: { idle: 0, run: 1, jump: 2, fall: 3, attack: 4, skill: 5, hit: 6, ko: 7, roll: 1 },
        frameCounts: { idle: 4, run: 6, jump: 4, fall: 4, attack: 4, skill: 6, hit: 3, ko: 1, roll: 6 },
        skill: {
            name: 'REEEEEE',
            type: 'projectile',
            data: {
                speedX: 12, speedY: 0, damage: 20, width: 40, height: 40,
                color: '#00ff00', shape: 'rect', life: 60, knockback: 10
            }
        }
    },
    {
        id: 'nyan_cat',
        name: 'Nyan Cat',
        asset: 'nyan_cat.png',
        description: 'The Standard Bearer.',
        stats: { speed: 12, jump: 25, damage: 10 },
        rows: { idle: 0, run: 1, jump: 2, fall: 3, attack: 4, skill: 5, hit: 6, ko: 7, roll: 1 },
        frameCounts: { idle: 6, run: 6, jump: 6, fall: 6, attack: 6, skill: 6, hit: 4, ko: 1, roll: 6 },
        skill: {
            name: 'RAINBOW BLAST',
            type: 'projectile',
            data: {
                speedX: 15, speedY: 0, damage: 15, width: 100, height: 30,
                color: '#ff00ff', shape: 'rect', life: 50, knockback: 20
            }
        }
    },
    {
        id: 'capybara',
        name: 'Capy',
        asset: 'capybara.png',
        description: 'Ok I pull up.',
        stats: { speed: 6, jump: 12, damage: 18 },
        rows: { idle: 0, run: 1, jump: 2, fall: 3, attack: 4, skill: 5, hit: 6, ko: 7, roll: 1 },
        frameCounts: { idle: 4, run: 6, jump: 4, fall: 4, attack: 4, skill: 6, hit: 3, ko: 1, roll: 6 },
        skill: {
            name: 'CHILL VIBES',
            type: 'aoe',
            data: { range: 250, damage: 1, interval: 10, duration: 300, visual: 'ripple' }
        }
    },
    {
        id: 'samurai',
        name: 'Doge Samurai',
        asset: 'samurai.png',
        description: 'Honor and Cheems.',
        stats: { speed: 9, jump: 18, damage: 25 },
        rows: { idle: 0, run: 1, jump: 2, fall: 3, attack: 4, skill: 5, hit: 6, ko: 7, roll: 1 },
        frameCounts: { idle: 4, run: 6, jump: 4, fall: 4, attack: 5, skill: 6, hit: 3, ko: 1, roll: 6 },
        skill: {
            name: 'KATANA SLASH',
            type: 'dash',
            data: { speed: 35, damage: 40, range: 100, invuln: true }
        }
    },
    {
        id: 'ninja',
        name: 'Shadow Fox',
        asset: 'shadow-fox-ninja.png',
        description: 'Silent but deadly.',
        stats: { speed: 13, jump: 22, damage: 15 },
        rows: { idle: 0, run: 1, jump: 2, fall: 3, attack: 4, skill: 5, hit: 6, ko: 7, roll: 1 },
        frameCounts: { idle: 4, run: 6, jump: 4, fall: 4, attack: 5, skill: 6, hit: 3, ko: 1, roll: 6 },
        skill: {
            name: 'SHURIKEN',
            type: 'projectile',
            data: {
                speedX: 20, speedY: 1, gravity: 0.1, damage: 10, width: 20, height: 20,
                color: '#333', shape: 'circle', life: 80
            }
        }
    },
    {
        id: 'dino',
        name: 'Dinosaurus',
        asset: 'dinosaurus.png',
        description: 'Prehistoric Chonk.',
        stats: { speed: 5, jump: 10, damage: 35 },
        rows: { idle: 0, run: 1, jump: 2, fall: 3, attack: 4, skill: 5, hit: 6, ko: 7, roll: 1 },
        frameCounts: { idle: 4, run: 6, jump: 4, fall: 4, attack: 5, skill: 6, hit: 3, ko: 1, roll: 6 },
        skill: {
            name: 'JURASSIC ROAR',
            type: 'aoe',
            data: { range: 300, damage: 0, stun: 60, duration: 20, visual: 'shockwave' }
        }
    },
    {
        id: 'luffy',
        name: 'Straw Hat',
        asset: 'luffy.png',
        description: 'I\'m gonna be King of the Pirates!',
        stats: { speed: 10, jump: 20, damage: 18 },
        rows: { idle: 0, run: 1, jump: 2, fall: 3, attack: 4, skill: 5, hit: 6, ko: 7, roll: 1 },
        frameCounts: { idle: 4, run: 6, jump: 4, fall: 4, attack: 5, skill: 6, hit: 3, ko: 1, roll: 6 },
        skill: {
            name: 'GOMU PISTOL',
            type: 'projectile',
            data: {
                speedX: 25, speedY: 0, damage: 30, width: 40, height: 30,
                color: '#f00', shape: 'rect', life: 40, knockback: 25
            }
        }
    },
    {
        id: 'chicken',
        name: 'Silly Chicken',
        asset: 'silly_chicken.png',
        description: 'Why did it cross the road? To fight.',
        stats: { speed: 11, jump: 22, damage: 14 },
        rows: { idle: 0, run: 1, jump: 2, fall: 3, attack: 4, skill: 5, hit: 6, ko: 7, roll: 1 },
        skill: {
            name: 'EGG BOMB',
            type: 'projectile',
            data: {
                speedX: 10, speedY: -10, gravity: 0.6, damage: 25, width: 20, height: 25,
                color: '#fff', shape: 'circle', onGround: 'bounce', life: 120
            }
        }
    },
    {
        id: 'banana_cat',
        name: 'Crying Banana Cat',
        asset: 'banana_cat.png',
        description: 'Sad but appealing.',
        stats: { speed: 7, jump: 14, damage: 16 },
        rows: { idle: 0, run: 1, jump: 2, fall: 3, attack: 4, skill: 5, hit: 6, ko: 7, roll: 1 },
        // Optimized frame counts
        frameCounts: { idle: 4, run: 6, jump: 4, fall: 4, attack: 5, skill: 6, hit: 3, ko: 1, roll: 6 },
        hitbox: { width: 60, height: 90 },
        skill: {
            name: 'TEAR FLOOD',
            type: 'aoe',
            data: { range: 250, damage: 2, interval: 15, duration: 180, visual: 'water' }
        }
    },
    {
        id: 'zoro',
        name: 'Zoro',
        asset: 'zoro.png',
        description: 'I\'m gonna be King of the Pirates!',
        stats: { speed: 10, jump: 20, damage: 18 },
        rows: { idle: 0, run: 1, jump: 2, fall: 3, attack: 4, skill: 5, hit: 6, ko: 7, roll: 1 },
        frameCounts: { idle: 4, run: 6, jump: 4, fall: 4, attack: 5, skill: 6, hit: 3, ko: 1, roll: 6 },
        skill: {
            name: 'GOMU PISTOL',
            type: 'projectile',
            data: {
                speedX: 25, speedY: 0, damage: 30, width: 40, height: 30,
                color: '#f00', shape: 'rect', life: 40, knockback: 25
            }
        }
    }
];

export const BACKGROUNDS = [
    { id: 'custom_bg', asset: 'background.png', name: 'Custom Arena' },
    { id: 'pepe_bg', asset: 'pepe_bg.png', name: 'Pepe World' },
];

export const MEME_WORDS = [
    "WOW!", "BONK!", "MUCH HURT", "SO BATTLE", "BRUH",
    "EZ", "OOF", "NOPE", "FEELS GOOD MAN", "COPE",
    "SEETHE", "ABSOLUTE UNIT", "REEEEEE", "BASED",
    "CRINGE", "BRUH MOMENT", "THIS IS FINE", "FEARLESS",
    "GIGACHAD VIBES", "SKILL ISSUE"
];
