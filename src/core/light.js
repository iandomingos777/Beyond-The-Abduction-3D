export class Light {
    constructor(gl) {
        this.position = [2.0, 2.0, 2.0]; // Posição X, Y, Z
        this.color = [1.0, 1.0, 1.0]; // Cor da luz (Branco)
        this.ambient = [0.2, 0.2, 0.2]; // Luz base (para não ficar tudo preto na sombra)
        this.shininess = 32.0; // Brilho especular
    }

    // Método para atualizar os uniforms no shader de uma vez só
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
