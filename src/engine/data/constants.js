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
        asset: 'characters/buff_doge/spritesheet.png',
        description: 'The ultimate absolute unit.',
        stats: { speed: 6, jump: 15, damage: 20 },
        rows: { idle: 0, run: 1, jump: 2, fall: 3, attack: 4, skill: 5, hit: 6, ko: 7, roll: 1 },
        frameCounts: { idle: 4, run: 6, jump: 4, fall: 4, attack: 6, skill: 6, hit: 3, ko: 1, roll: 6 },
        skill: {
            name: 'ABSOLUTE UNIT',
            type: 'buff',
            data: { scale: 1.5, damageMult: 1.5, duration: 120, effect: 'buff_aura' }
        }
    },
    {
        id: 'pepe',
        name: 'Feels Good Pepe',
        asset: 'characters/pepe/spritesheet.png',
        description: 'It is what it is.',
        stats: { speed: 8, jump: 20, damage: 15 },
        rows: { idle: 0, run: 1, jump: 2, fall: 3, attack: 4, skill: 5, hit: 6, ko: 7, roll: 1 },
        frameCounts: { idle: 4, run: 6, jump: 4, fall: 4, attack: 4, skill: 6, hit: 3, ko: 1, roll: 6 },
        skill: {
            name: 'REEEEEE',
            type: 'projectile',
            data: {
                speedX: 12, speedY: 0, damage: 20, width: 40, height: 40,
                color: '#00ff00', shape: 'rect', life: 60, knockback: 10, effect: 'fireball'
            }
        }
    },
    {
        id: 'capybara',
        name: 'Capy',
        asset: 'characters/capybara/spritesheet.png',
        description: 'Ok I pull up.',
        stats: { speed: 6, jump: 12, damage: 18 },
        rows: { idle: 0, run: 1, jump: 2, fall: 3, attack: 4, skill: 5, hit: 6, ko: 7, roll: 1 },
        frameCounts: { idle: 4, run: 6, jump: 4, fall: 4, attack: 4, skill: 6, hit: 3, ko: 1, roll: 6 },
        skill: {
            name: 'CHILL VIBES',
            type: 'aoe',
            data: { range: 250, damage: 1, interval: 10, duration: 300, visual: 'ripple', effect: 'shockwave' }
        }
    },
    {
        id: 'samurai',
        name: 'Doge Samurai',
        asset: 'characters/samurai/spritesheet.png',
        description: 'Honor and Cheems.',
        stats: { speed: 9, jump: 18, damage: 25 },
        rows: { idle: 0, run: 1, jump: 2, fall: 3, attack: 4, skill: 5, hit: 6, ko: 7, roll: 1 },
        frameCounts: { idle: 4, run: 6, jump: 4, fall: 4, attack: 5, skill: 6, hit: 3, ko: 1, roll: 6 },
        skill: {
            name: 'KATANA SLASH',
            type: 'dash',
            data: { speed: 35, damage: 40, range: 100, invuln: true, effect: 'slash' }
        }
    },
    {
        id: 'ninja',
        name: 'Shadow Fox',
        asset: 'characters/ninja/spritesheet.png',
        description: 'Silent but deadly.',
        stats: { speed: 13, jump: 22, damage: 15 },
        rows: { idle: 0, run: 1, jump: 2, fall: 3, attack: 4, skill: 5, hit: 6, ko: 7, roll: 1 },
        frameCounts: { idle: 4, run: 6, jump: 4, fall: 4, attack: 5, skill: 6, hit: 3, ko: 1, roll: 6 },
        skill: {
            name: 'SHURIKEN',
            type: 'projectile',
            data: {
                speedX: 20, speedY: 1, gravity: 0.1, damage: 10, width: 20, height: 20,
                color: '#333', shape: 'circle', life: 80, effect: 'shuriken'
            }
        }
    },
    {
        id: 'dino',
        name: 'Dinosaurus',
        asset: 'characters/dino/spritesheet.png',
        description: 'Prehistoric Chonk.',
        stats: { speed: 5, jump: 10, damage: 35 },
        rows: { idle: 0, run: 1, jump: 2, fall: 3, attack: 4, skill: 5, hit: 6, ko: 7, roll: 1 },
        frameCounts: { idle: 4, run: 6, jump: 4, fall: 4, attack: 5, skill: 6, hit: 3, ko: 1, roll: 6 },
        skill: {
            name: 'JURASSIC ROAR',
            type: 'aoe',
            data: { range: 300, damage: 0, stun: 60, duration: 20, visual: 'shockwave', effect: 'shockwave' }
        }
    },
    {
        id: 'chicken',
        name: 'Silly Chicken',
        asset: 'characters/chicken/spritesheet.png',
        description: 'Why did it cross the road? To fight.',
        stats: { speed: 11, jump: 22, damage: 14 },
        rows: { idle: 0, run: 1, jump: 2, fall: 3, attack: 4, skill: 5, hit: 6, ko: 7, roll: 1 },
        frameCounts: { idle: 4, run: 6, jump: 4, fall: 4, attack: 5, skill: 6, hit: 3, ko: 1, roll: 6 },
        skill: {
            name: 'EGG BOMB',
            type: 'projectile',
            data: {
                speedX: 10, speedY: -10, gravity: 0.6, damage: 25, width: 20, height: 25,
                color: '#fff', shape: 'circle', onGround: 'bounce', life: 120, effect: 'egg_bomb'
            }
        }
    },
    {
        id: 'zoro',
        name: 'Zoro',
        asset: 'characters/zoro/spritesheet.png',
        description: 'I\'m gonna be King of the Pirates!',
        stats: { speed: 10, jump: 20, damage: 18 },
        rows: { idle: 0, run: 1, jump: 2, fall: 3, attack: 4, skill: 5, hit: 6, ko: 7, roll: 1 },
        frameCounts: { idle: 4, run: 6, jump: 4, fall: 4, attack: 5, skill: 6, hit: 3, ko: 1, roll: 6 },
        skill: {
            name: 'SANTORYU',
            type: 'dash',
            data: { speed: 40, damage: 30, range: 100, invuln: true, effect: 'slash' }
        }
    },
    {
        id: 'hamster',
        name: 'Hamster',
        asset: 'characters/hamster/spritesheet.png',
        description: 'Small but hungry.',
        stats: { speed: 8, jump: 16, damage: 14 },
        rows: { idle: 0, run: 1, jump: 2, fall: 3, attack: 4, skill: 5, hit: 6, ko: 7, roll: 1 },
        frameCounts: { idle: 4, run: 6, jump: 4, fall: 4, attack: 5, skill: 6, hit: 3, ko: 1, roll: 6 },
        skill: {
            name: 'SEED SNACK',
            type: 'buff',
            data: { scale: 1.2, damageMult: 1.2, duration: 150, effect: 'buff_aura' }
        }
    },
    {
        id: 'cutecat',
        name: 'Cute Cat',
        asset: 'characters/cutecat/spritesheet.png',
        description: 'So cute it hurts.',
        stats: { speed: 9, jump: 18, damage: 10 },
        rows: { idle: 0, run: 1, jump: 2, fall: 3, attack: 4, skill: 5, hit: 6, ko: 7, roll: 1 },
        frameCounts: { idle: 4, run: 6, jump: 4, fall: 4, attack: 5, skill: 6, hit: 3, ko: 1, roll: 6 },
        skill: {
            name: 'CUTE OVERLOAD',
            type: 'aoe',
            data: { range: 400, damage: 5, stun: 180, interval: 30, duration: 150, visual: 'shake', effect: 'hearts' }
        }
    },
    {
        id: 'cell_perfect',
        name: 'Cell Perfect',
        asset: 'characters/cell_perfect/spritesheet.png',
        description: 'Perfection at its finest.',
        stats: { speed: 11, jump: 22, damage: 22 },
        rows: { idle: 0, run: 1, jump: 2, fall: 3, attack: 4, skill: 5, hit: 6, ko: 7, roll: 1 },
        frameCounts: { idle: 4, run: 6, jump: 4, fall: 4, attack: 5, skill: 6, hit: 3, ko: 1, roll: 6 },
        skill: {
            name: 'SOLAR KAMEHAMEHA',
            type: 'projectile',
            data: {
                speedX: 22, speedY: 0, damage: 35, width: 50, height: 50,
                color: '#0f0', shape: 'circle', life: 60, knockback: 30, effect: 'fireball', frames: 4
            }
        }
    },
    {
        id: 'white_bread',
        name: 'White Bread',
        asset: 'characters/white_bread/spritesheet.png',
        description: 'The staple of life.',
        stats: { speed: 7, jump: 15, damage: 16 },
        rows: { idle: 0, run: 1, jump: 2, fall: 3, attack: 4, skill: 5, hit: 6, ko: 7, win: 8, roll: 1 },
        frameCounts: { idle: 4, run: 6, jump: 4, fall: 4, attack: 4, skill: 4, hit: 3, ko: 1, win: 4, roll: 6 },
        skill: {
            name: 'CARB OVERLOAD',
            type: 'buff',
            data: { scale: 1.1, damageMult: 1.3, duration: 180, effect: 'buff_aura' }
        }
    },
    {
        id: 'luffy_nikka',
        name: 'Gear 5 Luffy',
        asset: 'characters/luffy_nikka/spritesheet.png',
        description: 'The Warrior of Liberation.',
        stats: { speed: 12, jump: 25, damage: 25 },
        rows: { idle: 0, run: 1, jump: 2, fall: 3, attack: 4, skill: 5, hit: 6, ko: 7, win: 8, roll: 1 },
        frameCounts: { idle: 4, run: 6, jump: 4, fall: 4, attack: 5, skill: 6, hit: 3, ko: 1, win: 4, roll: 6 },
        skill: {
            name: 'BAJRANG GUN',
            type: 'projectile',
            data: {
                speedX: 20, speedY: 0, damage: 40, width: 80, height: 80,
                color: '#fff', shape: 'circle', life: 50, knockback: 35, effect: 'fist_giant'
            }
        }
    },
    {
        id: 'tieu_yeu_ech',
        name: 'Tiểu Yêu Ếch',
        asset: 'characters/tieu_yeu_ech/spritesheet.png',
        description: 'Ếch ộp tuần núi.',
        stats: { speed: 10, jump: 20, damage: 12 },
        rows: { idle: 0, run: 1, jump: 2, fall: 3, attack: 4, skill: 5, hit: 6, ko: 7, win: 8, roll: 1 },
        frameCounts: { idle: 4, run: 6, jump: 4, fall: 4, attack: 4, skill: 5, hit: 3, ko: 1, win: 4, roll: 6 },
        skill: {
            name: 'LƯỠI KÍCH',
            type: 'projectile',
            data: {
                speedX: 20, speedY: 0, damage: 15, width: 40, height: 15,
                color: '#0f0', shape: 'rect', life: 40, knockback: 15, effect: 'slime_shot'
            }
        }
    },
    {
        id: 'crocodile',
        name: 'Cá Sấu',
        asset: 'characters/crocodile/spritesheet.png',
        description: 'Sông nước miền Tây.',
        stats: { speed: 8, jump: 15, damage: 18 },
        rows: { idle: 0, run: 1, jump: 2, fall: 3, attack: 4, skill: 5, hit: 7, ko: 8, roll: 1 },
        frameCounts: { idle: 4, run: 6, jump: 4, fall: 4, attack: 4, skill: 4, hit: 3, ko: 1, roll: 6 },
        skill: {
            name: 'DEATH ROLL',
            type: 'aoe',
            data: { range: 200, damage: 25, interval: 10, duration: 60, visual: 'spin', effect: 'water_spin' }
        }
    },
    {
        id: 'tieu_yeu_chon',
        name: 'Tiểu Yêu Chồn',
        asset: 'characters/tieu_yeu_chon/spritesheet.png',
        description: 'Thợ đào hố chuyên nghiệp.',
        stats: { speed: 9, jump: 16, damage: 14 },
        rows: { idle: 0, run: 1, jump: 2, fall: 3, attack: 4, skill: 6, hit: 7, ko: 8, roll: 1 },
        frameCounts: { idle: 4, run: 6, jump: 4, fall: 4, attack: 4, skill: 4, hit: 3, ko: 1, roll: 6 },
        skill: {
            name: 'TORNADO SPADE',
            type: 'aoe',
            data: { speed: 20, damage: 20, range: 150, invuln: false, effect: 'impact' }
        }
    },
    {
        id: 'tieu_yeu_vuon',
        name: 'Tiểu Yêu Vượn',
        asset: 'characters/tieu_yeu_vuon/spritesheet.png',
        description: 'Sức mạnh hoang dã.',
        stats: { speed: 7, jump: 14, damage: 20 },
        rows: { idle: 0, run: 1, jump: 2, fall: 3, attack: 4, skill: 5, hit: 6, ko: 7, roll: 1 },
        frameCounts: { idle: 4, run: 6, jump: 4, fall: 4, attack: 4, skill: 4, hit: 3, ko: 1, roll: 6 },
        skill: {
            name: 'PRIMAL SCREAM',
            type: 'aoe',
            data: { range: 250, damage: 10, stun: 100, interval: 20, duration: 40, visual: 'shockwave', effect: 'shockwave' }
        }
    },
    {
        id: 'horse',
        name: 'Chiến Mã',
        asset: 'characters/horse/spritesheet.png',
        description: 'Chạy nhanh như gió.',
        stats: { speed: 13, jump: 18, damage: 16 },
        rows: { idle: 0, run: 1, jump: 2, fall: 3, attack: 4, skill: 5, hit: 6, ko: 7, roll: 1 },
        frameCounts: { idle: 4, run: 6, jump: 4, fall: 4, attack: 4, skill: 4, hit: 3, ko: 1, roll: 6 },
        skill: {
            name: 'HORSE KICK',
            type: 'dash',
            data: { speed: 30, damage: 25, range: 120, invuln: true, effect: 'impact' }
        }
    },
    {
        id: 'shark',
        name: 'Cá Mập',
        asset: 'characters/shark/spritesheet.png',
        description: 'Hung thần đại dương.',
        stats: { speed: 10, jump: 15, damage: 22 },
        rows: { idle: 0, run: 1, jump: 2, fall: 3, attack: 4, skill: 5, hit: 6, ko: 7, roll: 1 },
        frameCounts: { idle: 4, run: 6, jump: 4, fall: 4, attack: 4, skill: 4, hit: 3, ko: 1, roll: 6 },
        skill: {
            name: 'JAWS SNAP',
            type: 'projectile',
            data: {
                speedX: 15, speedY: 0, damage: 30, width: 60, height: 40,
                color: '#00f', shape: 'rect', life: 50, knockback: 20, effect: 'water_spin'
            }
        }
    },
    {
        id: 'bull',
        name: 'Bò Tót',
        asset: 'characters/bull/spritesheet.png',
        description: 'Cục súc vô cực.',
        stats: { speed: 8, jump: 12, damage: 24 },
        rows: { idle: 0, run: 1, jump: 2, fall: 3, attack: 4, skill: 5, hit: 6, ko: 7, roll: 1 },
        frameCounts: { idle: 4, run: 6, jump: 4, fall: 4, attack: 4, skill: 4, hit: 3, ko: 1, roll: 6 },
        skill: {
            name: 'RAGING BULL',
            type: 'dash',
            data: { speed: 25, damage: 30, range: 150, invuln: true, effect: 'impact' }
        }
    },
    {
        id: 'seadog',
        name: 'Hải Cẩu',
        asset: 'characters/seadog/spritesheet.png',
        description: 'Vừa cute vừa chiến.',
        stats: { speed: 10, jump: 16, damage: 15 },
        rows: { idle: 0, run: 1, jump: 2, fall: 3, attack: 4, skill: 5, hit: 6, ko: 7, roll: 1 },
        frameCounts: { idle: 4, run: 6, jump: 4, fall: 4, attack: 4, skill: 4, hit: 3, ko: 1, roll: 6 },
        skill: {
            name: 'BEACH BALL',
            type: 'projectile',
            data: {
                speedX: 12, speedY: -10, gravity: 0.5, damage: 20, width: 30, height: 30,
                color: '#f0f', shape: 'circle', onGround: 'bounce', life: 100, effect: 'beach_ball'
            }
        }
    },
    {
        id: 'tieu_yeu_heo',
        name: 'Tiểu Yêu Heo',
        asset: 'characters/tieu_yeu_heo/spritesheet.png',
        description: 'Chỉ muốn về ngủ thôi...',
        stats: { speed: 7, jump: 12, damage: 20 },
        rows: { idle: 0, run: 1, jump: 2, fall: 3, attack: 4, skill: 5, hit: 6, ko: 7, win: 8, roll: 1 },
        frameCounts: { idle: 4, run: 6, jump: 4, fall: 4, attack: 4, skill: 5, hit: 3, ko: 1, win: 4, roll: 6 },
        skill: {
            name: 'HÚC ĐẦU',
            type: 'dash',
            data: { speed: 20, damage: 20, range: 150, invuln: false, effect: 'impact' }
        }
    },
];

export const BACKGROUNDS = [
    { id: 'swamp', asset: 'backgrounds/swamp_jungle_bg.png', name: 'Đầm Lầy Ma Quái' },
    { id: 'beach', asset: 'backgrounds/sunny_beach_bg.png', name: 'Bãi Biển Thiên Đường' },
    { id: 'arena', asset: 'backgrounds/grand_arena_bg.png', name: 'Đấu Trường La Mã' },
    { id: 'meadow', asset: 'backgrounds/meadow_bg.png', name: 'Đồng Cỏ Xanh' },
];

export const MEME_WORDS = [
    "WOW!", "BONK!", "MUCH HURT", "SO BATTLE", "BRUH",
    "EZ", "OOF", "NOPE", "FEELS GOOD MAN", "COPE",
    "SEETHE", "ABSOLUTE UNIT", "REEEEEE", "BASED",
    "CRINGE", "BRUH MOMENT", "THIS IS FINE", "FEARLESS",
    "GIGACHAD VIBES", "SKILL ISSUE"
];
