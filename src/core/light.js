export class Light {
    constructor(gl) {
        this.position = [2.0, 2.0, 2.0];
        this.color = [0.7, 1.0, 0.7];
        this.ambient = [0.33, 0.33, 0.33];
        this.shininess = 35.0;
    }

    // Atualiza os uniforms no shader
    updateUniforms(gl, program) {
        const uLightPos = gl.getUniformLocation(program, 'uLightPos');
        const uLightColor = gl.getUniformLocation(program, 'uLightColor');
        const uAmbientColor = gl.getUniformLocation(program, 'uAmbientColor');
        // const uShininess = gl.getUniformLocation(program, 'uShininess');

        gl.uniform3fv(uLightPos, this.position);
        gl.uniform3fv(uLightColor, this.color);
        gl.uniform3fv(uAmbientColor, this.ambient);
        // gl.uniform1f(uShininess, this.shininess);
    }
}

export class Spotlight {
    constructor(
        pos = [0, 0, 0],
        dir = [0, -1, 0],
        color = [1, 1, 1],
        innerDeg = 30,
        outerDeg = 40,
        intensity = 1.0,
    ) {
        this.position = pos;
        this.direction = dir;
        this.color = color;
        // Cosseno do ângulo de corte para o shader
        this.innerCutoff = Math.cos((innerDeg * Math.PI) / 180);
        this.outerCutoff = Math.cos((outerDeg * Math.PI) / 180);
        this.intensity = intensity;
    }
}
