export class InputManager {
    constructor(canvas) {
        this.keys = {};
        this.mouseDelta = {x: 0, y: 0};
        this.canvas = canvas;

        // Teclado
        window.addEventListener('keydown', e => this.keys[e.key.toLowerCase()] = true);
        window.addEventListener('keyup', e => this.keys[e.key.toLowerCase()] = false);

        // Mouse
        this.canvas.requestPointerLock = this.canvas.requestPointerLock || this.canvas.mozRequestPointerLock;
        this.canvas.onclick = () => this.canvas.requestPointerLock();

        document.addEventListener('mousemove', e => {
            if (document.pointerLockElement === this.canvas) {
                this.mouseDelta.x += e.movementX;
                this.mouseDelta.y += e.movementY;
            }
        });
    }

    // Retorna intensidade do movimento WASD
    getAxis() {
        let forward = 0, right = 0;
        if (this.keys['w']) forward += 1;
        if (this.keys['s']) forward -= 1;
        if (this.keys['a']) right -= 1;
        if (this.keys['d']) right += 1;
        return {forward, right};
    }

    // Retorna movimento do mouse e reseta o delta
    getMouseDelta() {
        const delta = {x: this.mouseDelta.x, y: this.mouseDelta.y};
        this.mouseDelta.x = 0;
        this.mouseDelta.y = 0;
        return delta;
    }
}