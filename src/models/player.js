export class Player {
    constructor(startPos = [0, 0, 8]) {
        this.position = new Float32Array(startPos);

        // Atributos de Visão e Física
        this.yaw = -90;
        this.pitch = 0;
        this.eyeOffset = 1.8; // Aqui você controla a altura da câmera
        this.speed = 20.0;
        this.sensitivity = 0.9;
        this.isBuildingMode = false;
        this.flySpeed = 30.0;

        // Sistema de pulo
        this.velocityY = 0;
        this.jumpForce = 7.5;
        this.gravity = -22.0;
        this.isGrounded = true;

        // Tamanho para o sistema de colisão [largura, altura, profundidade]
        this.size = [0.6, 2.0, 0.6];
    }

    /**
     * Toggle building mode (fly mode sem colisão)
     */
    toggleBuildingMode() {
        const wasFlying = this.isBuildingMode;
        this.isBuildingMode = !this.isBuildingMode;

        // Se estava voando e agora voltou para walk mode, reposiciona no chão
        if (wasFlying && !this.isBuildingMode) {
            // Altura do chão padrão + altura do personagem
            this.position[1] = 0.0; // Ajuste conforme a altura do chão do seu mapa
            console.log('Building Mode: OFF (Walk Mode) - Retornado ao chão');
        } else {
            console.log(
                `Building Mode: ${this.isBuildingMode ? 'ON (Fly Mode)' : 'OFF (Walk Mode)'}`,
            );
        }
    }

    /**
     * Retorna a posição dos olhos para a câmera
     */
    getEyePosition() {
        return [this.position[0], this.position[1] + this.eyeOffset, this.position[2]];
    }

    /**
     * Processa a rotação vinda do mouse
     */
    applyRotation(dx, dy) {
        this.yaw += dx * this.sensitivity;
        this.pitch -= dy * this.sensitivity;

        // Limita o olhar para cima/baixo (Gimbal Lock)
        if (this.pitch > 89.0) this.pitch = 89.0;
        if (this.pitch < -89.0) this.pitch = -89.0;
    }

    /**
     * Processa movimento e colisão
     */

    update(dt, input, collisionSystem) {
        if (this.isBuildingMode) {
            this._updateFlyMode(dt, input);
        } else {
            this._updateWalkMode(dt, input, collisionSystem);
        }
    }

    _updateWalkMode(dt, input, collisionSystem) {
        let moveX = 0;
        let moveZ = 0;

        // Direção baseada no Yaw (usamos apenas o plano horizontal XZ)
        const radYaw = (this.yaw * Math.PI) / 180;
        const forward = [Math.cos(radYaw), Math.sin(radYaw)];
        const right = [-forward[1], forward[0]];

        // Movimento horizontal (funciona no ar e no chão)
        if (input.isPressed('KeyW')) {
            moveX += forward[0];
            moveZ += forward[1];
        }
        if (input.isPressed('KeyS')) {
            moveX -= forward[0];
            moveZ -= forward[1];
        }
        if (input.isPressed('KeyA')) {
            moveX -= right[0];
            moveZ -= right[1];
        }
        if (input.isPressed('KeyD')) {
            moveX += right[0];
            moveZ += right[1];
        }

        // Pulo - funciona parado ou andando
        if (input.isPressed('Space') && this.isGrounded) {
            this.velocityY = this.jumpForce;
            this.isGrounded = false;
        }

        // Aplicar gravidade
        this.velocityY += this.gravity * dt;

        // Normalização para evitar velocidade diagonal excessiva
        const mag = Math.sqrt(moveX * moveX + moveZ * moveZ);
        const velocity = mag > 0 ? (this.speed * dt) / mag : 0;

        const nextPos = [
            this.position[0] + moveX * velocity,
            this.position[1] + this.velocityY * dt,
            this.position[2] + moveZ * velocity,
        ];

        // Resolve colisão
        if (collisionSystem) {
            const corrected = collisionSystem.resolveCollision(this.position, nextPos, this.size);
            this.position[0] = corrected[0];
            this.position[1] = corrected[1];
            this.position[2] = corrected[2];
        } else {
            this.position[0] = nextPos[0];
            this.position[1] = nextPos[1];
            this.position[2] = nextPos[2];
        }

        // Checar se está no chão
        if (this.position[1] <= 0.0) {
            this.position[1] = 0.0;
            this.velocityY = 0;
            this.isGrounded = true;
        }
    }

    // Modo Voar (Sem colisão, sem gravidade)
    _updateFlyMode(dt, input) {
        let moveX = 0,
            moveY = 0,
            moveZ = 0;
        const radYaw = (this.yaw * Math.PI) / 180;
        const radPitch = (this.pitch * Math.PI) / 180;

        // Vetores de direção 3D reais para voar para onde olha
        const forward = [
            Math.cos(radYaw) * Math.cos(radPitch),
            Math.sin(radPitch),
            Math.sin(radYaw) * Math.cos(radPitch),
        ];
        const right = [-Math.sin(radYaw), 0, Math.cos(radYaw)];

        if (input.isPressed('KeyW')) {
            this.position[0] += forward[0] * this.flySpeed * dt;
            this.position[1] += forward[1] * this.flySpeed * dt;
            this.position[2] += forward[2] * this.flySpeed * dt;
        }
        if (input.isPressed('KeyS')) {
            this.position[0] -= forward[0] * this.flySpeed * dt;
            this.position[1] -= forward[1] * this.flySpeed * dt;
            this.position[2] -= forward[2] * this.flySpeed * dt;
        }
        if (input.isPressed('KeyA')) {
            this.position[0] -= right[0] * this.flySpeed * dt;
            this.position[2] -= right[2] * this.flySpeed * dt;
        }
        if (input.isPressed('KeyD')) {
            this.position[0] += right[0] * this.flySpeed * dt;
            this.position[2] += right[2] * this.flySpeed * dt;
        }

        // Teclas extras para subir/descer verticalmente
        if (input.isPressed('Space')) this.position[1] += this.flySpeed * dt;
        if (input.isPressed('ShiftLeft')) this.position[1] -= this.flySpeed * dt;

        // Limites de Y para evitar cair infinito ou subir demais
        const MIN_Y = -10.0;
        const MAX_Y = 50.0;
        if (this.position[1] < MIN_Y) this.position[1] = MIN_Y;
        if (this.position[1] > MAX_Y) this.position[1] = MAX_Y;

        this.velocityLineY = 0; // Reseta gravidade para quando sair do modo building
    }
}
