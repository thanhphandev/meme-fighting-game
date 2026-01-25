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
        id: 'gigachad',
        name: 'GigaChad',
        asset: 'gigachad.png',
        description: 'Average fight enjoyer.',
        stats: { speed: 7, jump: 16, damage: 22 },
        rows: { idle: 0, run: 1, jump: 2, fall: 3, attack: 4, skill: 5, hit: 6, ko: 7, roll: 1 },
        skill: { name: 'CHAD ENERGY', type: 'dash' }
    },
    {
        id: 'nyan_cat',
        name: 'Nyan Cat',
        asset: 'nyan_cat.png',
        description: 'Rainbow speedster.',
        stats: { speed: 12, jump: 25, damage: 10 },
        rows: { idle: 0, run: 1, jump: 2, fall: 3, attack: 4, skill: 5, hit: 6, ko: 7, roll: 1 },
        skill: { name: 'RAINBOW BLAST', type: 'projectile' }
    },
    {
        id: 'shrek',
        name: 'The Ogre',
        asset: 'shrek.png',
        description: 'Get out of my swamp!',
        stats: { speed: 5, jump: 12, damage: 25 },
        rows: { idle: 0, run: 1, jump: 2, fall: 3, attack: 4, skill: 5, hit: 6, ko: 7, roll: 1 },
        skill: { name: 'SWAMP ROAR', type: 'buff' }
    },
    {
        id: 'bald_man',
        name: 'Baldy',
        asset: 'bald_man.png',
        description: 'Just a hero for fun.',
        stats: { speed: 10, jump: 20, damage: 30 },
        rows: { idle: 0, run: 1, jump: 2, fall: 3, attack: 4, skill: 5, hit: 6, ko: 7, roll: 1 },
        skill: { name: 'SERIOUS PUNCH', type: 'slam' }
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
