import * as mat4 from '../math/mat4.js';

export class Camera {
    constructor(canvas, position = [0, 0, 8]) {
        this.canvas = canvas;

        // Estado
        this.position = new Float32Array(position);
        this.front = new Float32Array([0, 0, -1]); // Olhando para o fundo
        this.up = new Float32Array([0, 1, 0]);
        this.worldUp = new Float32Array([0, 1, 0]);

        // Rotação (Euler Angles)
        this.yaw = -90; // -90 para olhar para o Z negativo
        this.pitch = 0;

        // Configurações
        this.speed = 5.0; // Unidades por segundo
        this.sensitivity = 0.1; // Sensibilidade do mouse
        this.isEnabled = false; // Flag para ativar/desativar

        // Input
        this.keys = {};

        // Colisão
        this.collisionSystem = null; // Será definido externamente
        this.playerSize = [0.5, 1.8, 0.5]; // [width, height, depth]

        this._initInput();
    }

    /**
     * Define o sistema de colisão a ser usado
     */
    setCollisionSystem(collisionSystem) {
        this.collisionSystem = collisionSystem;
    }

    // Liga/Desliga o controle
    toggle(state) {
        this.isEnabled = state;
        if (state) {
            this.canvas.requestPointerLock();
        } else {
            document.exitPointerLock();
        }
    }

    _initInput() {
        // Teclado
        window.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
        });
        window.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });

        // Mouse (Rotação)
        document.addEventListener('mousemove', (e) => {
            if (!this.isEnabled || document.pointerLockElement !== this.canvas) return;

            const xoffset = e.movementX * this.sensitivity;
            const yoffset = e.movementY * this.sensitivity; // Inverter se necessário

            this.yaw += xoffset;
            this.pitch -= yoffset;

            // Limitar o olhar para cima/baixo (Gimbal Lock)
            if (this.pitch > 89.0) this.pitch = 89.0;
            if (this.pitch < -89.0) this.pitch = -89.0;

            this._updateVectors();
        });

        // Clique no canvas para ativar (opcional, pode ser feito via botão na UI)
        this.canvas.addEventListener('click', () => {
            if (!this.isEnabled) this.toggle(true);
        });

        // Detecta se o usuário apertou ESC para sair do lock
        document.addEventListener('pointerlockchange', () => {
            if (document.pointerLockElement !== this.canvas) {
                this.isEnabled = false;
            } else {
                this.isEnabled = true;
            }
        });

        this._updateVectors(); // Inicializa vetor front
    }

    _updateVectors() {
        // Converte Euler Angles para vetor Direção (Trigonometria esférica)
        const radYaw = (this.yaw * Math.PI) / 180;
        const radPitch = (this.pitch * Math.PI) / 180;

        const x = Math.cos(radYaw) * Math.cos(radPitch);
        const y = Math.sin(radPitch);
        const z = Math.sin(radYaw) * Math.cos(radPitch);

        this.front = this._normalize([x, y, z]);
    }

    update(dt) {
        if (!this.isEnabled) return;

        // Salva posição antiga para colisão
        const oldPosition = [...this.position];

        const velocity = this.speed * dt;

        // Calcula nova posição desejada (sem colisão ainda)
        let newPosition = [...this.position];

        // W - Frente
        if (this.keys['KeyW']) {
            newPosition = this._add(newPosition, this._scale(this.front, velocity));
        }
        // S - Trás
        if (this.keys['KeyS']) {
            newPosition = this._sub(newPosition, this._scale(this.front, velocity));
        }
        // A - Esquerda (Cross Product entre Front e WorldUp)
        if (this.keys['KeyA']) {
            const right = this._normalize(this._cross(this.front, this.worldUp));
            newPosition = this._sub(newPosition, this._scale(right, velocity));
        }
        // D - Direita
        if (this.keys['KeyD']) {
            const right = this._normalize(this._cross(this.front, this.worldUp));
            newPosition = this._add(newPosition, this._scale(right, velocity));
        }
        // Q - Descer (Global)
        if (this.keys['KeyQ']) {
            newPosition = this._sub(newPosition, this._scale(this.worldUp, velocity));
        }
        // E - Subir (Global)
        if (this.keys['KeyE']) {
            newPosition = this._add(newPosition, this._scale(this.worldUp, velocity));
        }

        // Aplica sistema de colisão (se disponível)
        if (this.collisionSystem) {
            newPosition = this.collisionSystem.resolveCollision(
                oldPosition,
                newPosition,
                this.playerSize
            );
        }

        // Atualiza posição final
        this.position = new Float32Array(newPosition);
    }

    // Retorna a ViewMatrix para o Shader
    getViewMatrix() {
        // target = position + front
        const target = this._add(this.position, this.front);
        return mat4.createCamera(this.position, target, this.up);
    }

    // --- Utilitários de Vetor (para não depender de libs externas além do necessário) ---
    _normalize(v) {
        const len = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
        if (len === 0) return [0, 0, 0];
        return [v[0] / len, v[1] / len, v[2] / len];
    }
    _cross(a, b) {
        return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
    }
    _add(a, b) {
        return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
    }
    _sub(a, b) {
        return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
    }
    _scale(v, s) {
        return [v[0] * s, v[1] * s, v[2] * s];
    }
}
