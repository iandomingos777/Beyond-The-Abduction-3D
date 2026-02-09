import { Spotlight } from '../core/light.js';

export class CamLight {
    constructor(startPos, inner = 30, outer = 40) {
        // Inicializa a instância da luz
        this.light = new Spotlight(startPos, [0, -1, 0], [1, 1, 1], inner, outer, 1.5);

        this.angle = 0;
        this.speed = 5.0;
        this.range = 0.6;
    }

    update(deltaTime) {
        this.angle += this.speed * deltaTime;

        // Atualiza propriedades da luz
        this.light.direction[0] = Math.sin(this.angle) * this.range;
        this.light.direction[1] = -1.0;

        // Normalização
        const len = Math.hypot(...this.light.direction);
        this.light.direction = this.light.direction.map((v) => v / len);
    }

    // Atualiza uniformes da luz
    draw(gl, program) {
        this.light.updateUniforms(gl, program);
    }
}
