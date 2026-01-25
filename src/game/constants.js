export const CONFIG = {
    canvasWidth: 1000,
    canvasHeight: 500,
    gravity: 0.8,
    groundY: 60,
    fps: 48,
    baseHp: 200,
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
