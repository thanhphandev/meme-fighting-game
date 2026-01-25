export class InputHandler {
    constructor() {
        this.keys = new Set();
        this.handleKeyDown = (e) => this.keys.add(e.key.toLowerCase());
        this.handleKeyUp = (e) => this.keys.delete(e.key.toLowerCase());

        window.addEventListener('keydown', this.handleKeyDown);
        window.addEventListener('keyup', this.handleKeyUp);
    }

    getPlayerInput() {
        return {
            left: this.keys.has('a') || this.keys.has('arrowleft'),
            right: this.keys.has('d') || this.keys.has('arrowright'),
            up: this.keys.has('w') || this.keys.has('arrowup'),
            attack: this.keys.has(' ') || this.keys.has('j') || this.keys.has('f'),
            roll: this.keys.has('shift') || this.keys.has('k') || this.keys.has('l'),
            skill: this.keys.has('e') || this.keys.has('q') || this.keys.has('u')
        };
    }

    destroy() {
        window.removeEventListener('keydown', this.handleKeyDown);
        window.removeEventListener('keyup', this.handleKeyUp);
    }
}
