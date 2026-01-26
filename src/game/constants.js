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
        skill: { name: 'MUCH SPEED', type: 'buff' }
    },
    {
        id: 'buff_doge',
        name: 'Muscular Doge',
        asset: 'buff_doge.png',
        description: 'The ultimate absolute unit.',
        stats: { speed: 6, jump: 15, damage: 20 },
        rows: { idle: 0, run: 1, jump: 2, fall: 3, attack: 4, skill: 5, hit: 6, ko: 7, roll: 1 },
        skill: { name: 'ABSOLUTE UNIT', type: 'slam' }
    },
    {
        id: 'pepe',
        name: 'Feels Good Pepe',
        asset: 'pepe.png',
        description: 'It is what it is.',
        stats: { speed: 8, jump: 20, damage: 15 },
        rows: { idle: 0, run: 1, jump: 2, fall: 3, attack: 4, skill: 5, hit: 6, ko: 7, roll: 1 },
        skill: { name: 'REEEEEE', type: 'projectile' }
    },
    {
        id: 'nyan_cat',
        name: 'Nyan Cat',
        asset: 'nyan_cat.png',
        description: 'The Standard Bearer.',
        stats: { speed: 12, jump: 25, damage: 10 },
        rows: { idle: 0, run: 1, jump: 2, fall: 3, attack: 4, skill: 5, hit: 6, ko: 7, roll: 1 },
        skill: { name: 'RAINBOW BLAST', type: 'projectile' }
    },
    {
        id: 'capybara',
        name: 'Capy',
        asset: 'capybara.png',
        description: 'Ok I pull up.',
        stats: { speed: 6, jump: 12, damage: 18 },
        rows: { idle: 0, run: 1, jump: 2, fall: 3, attack: 4, skill: 5, hit: 6, ko: 7, roll: 1 },
        skill: { name: 'CHILL VIBES', type: 'buff' }
    },
    {
        id: 'samurai',
        name: 'Doge Samurai',
        asset: 'samurai.png',
        description: 'Honor and Cheems.',
        stats: { speed: 9, jump: 18, damage: 25 },
        rows: { idle: 0, run: 1, jump: 2, fall: 3, attack: 4, skill: 5, hit: 6, ko: 7, roll: 1 },
        skill: { name: 'KATANA SLASH', type: 'dash' }
    },
    {
        id: 'ninja',
        name: 'Shadow Fox',
        asset: 'shadow-fox-ninja.png',
        description: 'Silent but deadly.',
        stats: { speed: 13, jump: 22, damage: 15 },
        rows: { idle: 0, run: 1, jump: 2, fall: 3, attack: 4, skill: 5, hit: 6, ko: 7, roll: 1 },
        skill: { name: 'SHADOW STRIKE', type: 'projectile' }
    },
    {
        id: 'dino',
        name: 'Dinosaurus',
        asset: 'dinosaurus.png',
        description: 'Prehistoric Chonk.',
        stats: { speed: 5, jump: 10, damage: 35 },
        rows: { idle: 0, run: 1, jump: 2, fall: 3, attack: 4, skill: 5, hit: 6, ko: 7, roll: 1 },
        skill: { name: 'JURASSIC ROAR', type: 'buff' }
    },
    {
        id: 'chicken',
        name: 'Silly Chicken',
        asset: 'silly_chicken.png',
        description: 'Why did it cross the road? To fight.',
        stats: { speed: 11, jump: 22, damage: 14 },
        rows: { idle: 0, run: 1, jump: 2, fall: 3, attack: 4, skill: 5, hit: 6, ko: 7, roll: 1 },
        skill: { name: 'EGG BOMB', type: 'projectile' }
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
