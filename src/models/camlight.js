import { Spotlight } from '../core/light.js';

export class CamLight {
    constructor(startPos) {
        // Criamos a instância da luz DENTRO da classe
        this.light = new Spotlight(startPos);
        
        this.angle = 0;
        this.speed = 5.0;
        this.range = 0.6;
    }

    update(deltaTime) {
        this.angle += this.speed * deltaTime;

        // Alteramos diretamente as propriedades da instância interna
        this.light.direction[0] = Math.sin(this.angle) * this.range;
        this.light.direction[1] = -1.0; 
        
        // Normalização (essencial para o cálculo do cone no shader)
        const len = Math.hypot(...this.light.direction);
        this.light.direction = this.light.direction.map(v => v / len);
    }

    // Apenas repassa a ordem de atualização para a instância interna
    draw(gl, program) {
        this.light.updateUniforms(gl, program);
    }
}