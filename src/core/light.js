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

export class Spotlight {
    constructor(startPos = [0.0, 5.0, 0.0]) {
        this.position = startPos;  
        this.direction = [0.0, -1.0, 0.0]; 
        
        this.innerCutoff = Math.cos(Math.PI / 12); 
        this.outerCutoff = Math.cos(Math.PI / 9);  
        
        this.color = [0.0, 2.0, 2.0]; 
        // Removi o this.ambient daqui porque o shader já usa o uAmbientColor da luz global
    }

    updateUniforms(gl, program) {
        // IMPORTANTE: Mudar para os nomes uSpot... que criamos no Shader
        gl.uniform3fv(gl.getUniformLocation(program, 'uSpotPos'), this.position);
        gl.uniform3fv(gl.getUniformLocation(program, 'uSpotDir'), this.direction);
        gl.uniform3fv(gl.getUniformLocation(program, 'uSpotColor'), this.color);
        
        // Cutoffs
        gl.uniform1f(gl.getUniformLocation(program, 'uInnerCutoff'), this.innerCutoff);
        gl.uniform1f(gl.getUniformLocation(program, 'uOuterCutoff'), this.outerCutoff);
    }
}
