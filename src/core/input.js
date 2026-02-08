export class InputHandler {
    constructor() {
        this.keys = {};
        this.mouseDeltaX = 0;
        this.mouseDeltaY = 0;
        this.isPointerLocked = false;
        this.onBuildingModeToggle = null; // Callback para toggle de building mode

        this._initListeners();
    }

    _initListeners() {
        // Teclado
        window.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            
            // Toggle building mode com tecla 'B' (funciona sempre, mesmo sem pointer lock)
            if (e.code === 'KeyB') {
                console.log('Tecla B pressionada!');
                e.preventDefault();
                if (this.onBuildingModeToggle) {
                    console.log('Chamando onBuildingModeToggle...');
                    this.onBuildingModeToggle();
                } else {
                    console.warn('onBuildingModeToggle não foi configurado!');
                }
            }
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });

        // Mouse
        document.addEventListener('mousemove', (e) => {
            if (document.pointerLockElement) {
                this.mouseDeltaX = e.movementX;
                this.mouseDeltaY = e.movementY;
            }
        });

        // Estado do Pointer Lock
        document.addEventListener('pointerlockchange', () => {
            this.isPointerLocked = (document.pointerLockElement !== null);
        });
    }

    /**
     * Verifica se uma tecla está pressionada
     * @param {string} keyCode - Ex: 'KeyW', 'Space'
     */
    isPressed(keyCode) {
        return !!this.keys[keyCode];
    }

    /**
     * Retorna os movimentos do mouse e os zera para o próximo frame
     */
    consumeMouseDelta() {
        const delta = { x: this.mouseDeltaX, y: this.mouseDeltaY };
        this.mouseDeltaX = 0;
        this.mouseDeltaY = 0;
        return delta;
    }
}