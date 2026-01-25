export const CONFIG = {
    canvasWidth: 1000,
    canvasHeight: 500,
    gravity: 0.8,
    groundY: 60,
    fps: 12,
    baseHp: 500,
    baseDamage: 10,
    dashCost: 35,
    attackCost: 15,
    skillCost: 50,
    skillCooldown: 3000,
};

export const CHARACTERS = [
    {
        id: 'doge',
        name: 'Lil Doge',
        asset: 'doge.png',
        description: 'Much speed. Wow.',
        stats: { speed: 9, jump: 18, damage: 12 },
        rows: { idle: 0, run: 1, jump: 2, fall: 2, attack: 2, skill: 3, hit: 3, ko: 3 },
        skill: { name: 'MUCH SPEED', type: 'buff' }
    },
    {
        id: 'buff_doge',
        name: 'Muscular Doge',
        asset: 'buff_doge.png',
        description: 'The ultimate absolute unit.',
        stats: { speed: 6, jump: 15, damage: 20 },
        rows: { idle: 0, run: 1, jump: 2, fall: 2, attack: 2, skill: 3, hit: 3, ko: 3 },
        skill: { name: 'ABSOLUTE UNIT', type: 'slam' }
    },
    {
        id: 'pepe',
        name: 'Feels Good Pepe',
        asset: 'pepe.png',
        description: 'It is what it is.',
        stats: { speed: 8, jump: 20, damage: 15 },
        rows: { idle: 0, run: 1, jump: 2, fall: 2, attack: 2, skill: 3, hit: 3, ko: 3 },
        skill: { name: 'REEEEEE', type: 'projectile' }
    },
    {
        id: 'gigachad',
        name: 'GigaChad',
        asset: 'gigachad.png',
        description: 'Average fight enjoyer.',
        stats: { speed: 7, jump: 16, damage: 22 },
        rows: { idle: 0, run: 1, jump: 2, fall: 2, attack: 2, skill: 3, hit: 3, ko: 3 },
        skill: { name: 'CHAD ENERGY', type: 'dash' }
    }
];

export const BACKGROUNDS = [
    { id: 'meme_arena', asset: 'background.png', name: 'Meme Arena' },
    { id: 'this_is_fine', asset: 'pepe_bg.png', name: 'This Is Fine' }
];

export const MEME_WORDS = [
    "WOW!", "BONK!", "MUCH HURT", "SO BATTLE", "BRUH",
    "EZ", "OOF", "NOPE", "FEELS GOOD MAN", "COPE",
    "SEETHE", "ABSOLUTE UNIT", "REEEEEE", "BASED",
    "CRINGE", "BRUH MOMENT", "THIS IS FINE", "FEARLESS",
    "GIGACHAD VIBES", "SKILL ISSUE"
];
