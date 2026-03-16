export class InputHandler {
    constructor(keyMap) {
        this.keys = new Set();
        this.keyMap = keyMap || {
            left: ['a', 'arrowleft'],
            right: ['d', 'arrowright'],
            up: ['w', 'arrowup'],
            attack: [' ', 'j', 'f'],
            roll: ['shift', 'k', 'l'],
            skill: ['e', 'q', 'u']
        };

        this.handleKeyDown = (e) => {
            const key = e.key.toLowerCase();
            // Check if key is used in any map
            const isGameKey = Object.values(this.keyMap).some(keys => keys.includes(key));
            if (isGameKey) {
                // Allow F5 (refresh) or F12 (dev) if accidentally mapped, but usually safe
                // prevent defaults for space, arrows, backspace, etc.
                if (!['f5', 'f12'].includes(key)) e.preventDefault();
            }
            this.keys.add(key);
        };
        this.handleKeyUp = (e) => this.keys.delete(e.key.toLowerCase());
        this.handleBlur = () => this.keys.clear(); // Reset inputs on focus loss

        window.addEventListener('keydown', this.handleKeyDown);
        window.addEventListener('keyup', this.handleKeyUp);
        window.addEventListener('blur', this.handleBlur);
    }

    getPlayerInput() {
        const input = {
            left: false, right: false, up: false, attack: false, roll: false, skill: false
        };

        for (const [action, keys] of Object.entries(this.keyMap)) {
            if (keys.some(k => this.keys.has(k.toLowerCase()))) {
                input[action] = true;
            }
        }
        return input;
    }

    destroy() {
        window.removeEventListener('keydown', this.handleKeyDown);
        window.removeEventListener('keyup', this.handleKeyUp);
        window.removeEventListener('blur', this.handleBlur);
    }
}
