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
    },
    {
        id: 'hamster',
        name: 'Hamster',
        asset: 'hamster.png',
        description: 'Small but hungry.',
        stats: { speed: 8, jump: 16, damage: 14 },
        rows: { idle: 0, run: 1, jump: 2, fall: 3, attack: 4, skill: 5, hit: 6, ko: 7, roll: 1 },
        frameCounts: { idle: 4, run: 6, jump: 4, fall: 4, attack: 5, skill: 6, hit: 3, ko: 1, roll: 6 },
        skill: {
            name: 'SEED SNACK',
            type: 'buff',
            data: { scale: 1.2, damageMult: 1.2, duration: 150 }
        }
    },
    {
        id: 'cutecat',
        name: 'Cute Cat',
        asset: 'cutecat.png',
        description: 'So cute it hurts.',
        stats: { speed: 9, jump: 18, damage: 10 },
        rows: { idle: 0, run: 1, jump: 2, fall: 3, attack: 4, skill: 5, hit: 6, ko: 7, roll: 1 },
        frameCounts: { idle: 4, run: 6, jump: 4, fall: 4, attack: 5, skill: 6, hit: 3, ko: 1, roll: 6 },
        skill: {
            name: 'CUTE OVERLOAD',
            type: 'aoe',
            data: { range: 400, damage: 5, stun: 180, interval: 30, duration: 150, visual: 'shake' }
        }
    },
    {
        id: 'cell_perfect',
        name: 'Cell Perfect',
        asset: 'cell-perfect.png',
        description: 'Perfection at its finest.',
        stats: { speed: 11, jump: 22, damage: 22 },
        rows: { idle: 0, run: 1, jump: 2, fall: 3, attack: 4, skill: 5, hit: 6, ko: 7, roll: 1 },
        frameCounts: { idle: 4, run: 6, jump: 4, fall: 4, attack: 5, skill: 6, hit: 3, ko: 1, roll: 6 },
        skill: {
            name: 'SOLAR KAMEHAMEHA',
            type: 'projectile',
            data: {
                speedX: 22, speedY: 0, damage: 35, width: 50, height: 50,
                color: '#0f0', shape: 'circle', life: 60, knockback: 30
            }
        }
    },
    {
        id: 'white_bread',
        name: 'White Bread',
        asset: 'white-bread.png',
        description: 'The staple of life.',
        stats: { speed: 7, jump: 15, damage: 16 },
        rows: { idle: 0, run: 1, jump: 2, fall: 3, attack: 4, skill: 5, hit: 6, ko: 7, win: 8, roll: 1 },
        frameCounts: { idle: 4, run: 6, jump: 4, fall: 4, attack: 4, skill: 4, hit: 3, ko: 1, win: 4, roll: 6 },
        skill: {
            name: 'CARB OVERLOAD',
            type: 'buff',
            data: { scale: 1.1, damageMult: 1.3, duration: 180 }
        }
    },
    {
        id: 'luffy_nikka',
        name: 'Gear 5 Luffy',
        asset: 'luffy_nikka.png',
        description: 'The Warrior of Liberation.',
        stats: { speed: 12, jump: 25, damage: 25 },
        rows: { idle: 0, run: 1, jump: 2, fall: 3, attack: 4, skill: 5, hit: 6, ko: 7, win: 8, roll: 1 },
        frameCounts: { idle: 4, run: 6, jump: 4, fall: 4, attack: 5, skill: 6, hit: 3, ko: 1, win: 4, roll: 6 },
        skill: {
            name: 'BAJRANG GUN',
            type: 'projectile',
            data: {
                speedX: 20, speedY: 0, damage: 40, width: 80, height: 80,
                color: '#fff', shape: 'circle', life: 50, knockback: 35
            }
        }
    },
    {
        id: 'tieu_yeu_heo',
        name: 'Tiểu Yêu Heo',
        asset: 'tieu_yeu_heo.png',
        description: 'Chỉ muốn về ngủ thôi...',
        stats: { speed: 7, jump: 12, damage: 15 },
        rows: { idle: 0, run: 1, jump: 2, fall: 3, attack: 4, skill: 5, hit: 6, ko: 7, win: 8, roll: 1 },
        frameCounts: { idle: 4, run: 6, jump: 4, fall: 4, attack: 4, skill: 5, hit: 3, ko: 1, win: 4, roll: 6 },
        skill: {
            name: 'HÚC ĐẦU',
            type: 'dash',
            data: { speed: 20, damage: 20, range: 150, invuln: false }
        }
    },
    {
        id: 'tieu_yeu_ech',
        name: 'Tiểu Yêu Ếch',
        asset: 'tieu_yeu_ech.png',
        description: 'Ếch ộp tuần núi.',
        stats: { speed: 10, jump: 20, damage: 12 },
        rows: { idle: 0, run: 1, jump: 2, fall: 3, attack: 4, skill: 5, hit: 6, ko: 7, win: 8, roll: 1 },
        frameCounts: { idle: 4, run: 6, jump: 4, fall: 4, attack: 4, skill: 5, hit: 3, ko: 1, win: 4, roll: 6 },
        skill: {
            name: 'LƯỠI KÍCH',
            type: 'projectile',
            data: {
                speedX: 20, speedY: 0, damage: 15, width: 40, height: 15,
                color: '#0f0', shape: 'rect', life: 40, knockback: 15
            }
        }
    },
    {
        id: 'crocodile',
        name: 'Cá Sấu',
        asset: 'crocodile.png',
        description: 'Sông nước miền Tây.',
        stats: { speed: 8, jump: 15, damage: 18 },
        rows: { idle: 0, run: 1, jump: 2, fall: 3, attack: 4, skill: 5, hit: 7, ko: 8, roll: 1 },
        frameCounts: { idle: 4, run: 6, jump: 4, fall: 4, attack: 4, skill: 4, hit: 3, ko: 1, roll: 6 },
        skill: {
            name: 'DEATH ROLL',
            type: 'aoe',
            data: { range: 200, damage: 25, interval: 10, duration: 60, visual: 'spin' }
        }
    },
    {
        id: 'tieu_yeu_chon',
        name: 'Tiểu Yêu Chồn',
        asset: 'tieu_yeu_chon.png',
        description: 'Thợ đào hố chuyên nghiệp.',
        stats: { speed: 9, jump: 16, damage: 14 },
        rows: { idle: 0, run: 1, jump: 2, fall: 3, attack: 4, skill: 6, hit: 7, ko: 8, roll: 1 },
        frameCounts: { idle: 4, run: 6, jump: 4, fall: 4, attack: 4, skill: 4, hit: 3, ko: 1, roll: 6 },
        skill: {
            name: 'TORNADO SPADE',
            type: 'aoe',
            data: { range: 180, damage: 20, interval: 8, duration: 80, visual: 'spin' }
        }
    },
    {
        id: 'tieu_yeu_vuon',
        name: 'Tiểu Yêu Vượn',
        asset: 'tieu_yeu_vuon.png',
        description: 'Sức mạnh hoang dã.',
        stats: { speed: 7, jump: 14, damage: 20 },
        rows: { idle: 0, run: 1, jump: 2, fall: 3, attack: 4, skill: 5, hit: 6, ko: 7, roll: 1 },
        frameCounts: { idle: 4, run: 6, jump: 4, fall: 4, attack: 4, skill: 4, hit: 3, ko: 1, roll: 6 },
        skill: {
            name: 'PRIMAL SCREAM',
            type: 'aoe',
            data: { range: 250, damage: 10, stun: 100, interval: 20, duration: 40, visual: 'shockwave' }
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
