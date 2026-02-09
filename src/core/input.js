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
        // Eventos de teclado
        window.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;

            // Alterna modo de construção (Building Mode)
            if (e.code === 'KeyB') {
                e.preventDefault();
                if (this.onBuildingModeToggle) {
                    this.onBuildingModeToggle();
                }
            }
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });

        // Eventos de mouse
        document.addEventListener('mousemove', (e) => {
            if (document.pointerLockElement) {
                this.mouseDeltaX = e.movementX;
                this.mouseDeltaY = e.movementY;
            }
        });

        // Monitora estado do Pointer Lock
        document.addEventListener('pointerlockchange', () => {
            this.isPointerLocked = document.pointerLockElement !== null;
        });
    }

    /**
     * Verifica se uma tecla está pressionada.
     * @param {string} keyCode - Ex: 'KeyW', 'Space'
     */
    isPressed(keyCode) {
        return !!this.keys[keyCode];
    }

    /**
     * Retorna o movimento do mouse e reinicia para o próximo quadro.
     */
    consumeMouseDelta() {
        const delta = { x: this.mouseDeltaX, y: this.mouseDeltaY };
        this.mouseDeltaX = 0;
        this.mouseDeltaY = 0;
        return delta;
    }
}
