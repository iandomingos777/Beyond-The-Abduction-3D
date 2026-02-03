export class Cube {
    constructor(gl) {
        this.gl = gl;
        this.vertexBuffer = null;
        this.normalBuffer = null; // Adicionado
        this.vertexCount = 36;

        this.createBuffers();
    }

    createBuffers() {
        const gl = this.gl;

        // 1. Posições (X, Y, Z)
        const vertices = new Float32Array([
            // Frontal (Z+)
            -0.5, -0.5, 0.5, 0.5, -0.5, 0.5, 0.5, 0.5, 0.5, -0.5, -0.5, 0.5, 0.5, 0.5, 0.5, -0.5,
            0.5, 0.5,
            // Traseira (Z-)
            -0.5, -0.5, -0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5, -0.5, -0.5, -0.5, 0.5, 0.5, -0.5,
            0.5, -0.5, -0.5,
            // Superior (Y+)
            -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, 0.5, 0.5, 0.5, -0.5, 0.5, -0.5, 0.5, 0.5, 0.5, 0.5,
            0.5, -0.5,
            // Inferior (Y-)
            -0.5, -0.5, -0.5, 0.5, -0.5, -0.5, 0.5, -0.5, 0.5, -0.5, -0.5, -0.5, 0.5, -0.5, 0.5,
            -0.5, -0.5, 0.5,
            // Direita (X+)
            0.5, -0.5, -0.5, 0.5, 0.5, -0.5, 0.5, 0.5, 0.5, 0.5, -0.5, -0.5, 0.5, 0.5, 0.5, 0.5,
            -0.5, 0.5,
            // Esquerda (X-)
            -0.5, -0.5, -0.5, -0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5, -0.5, -0.5, -0.5, 0.5, 0.5,
            -0.5, 0.5, -0.5,
        ]);

        // 2. Normais (X, Y, Z) - Apontando para fora de cada face
        // Essencial para a luz funcionar!
        const normals = new Float32Array([
            // Frontal (0, 0, 1)
            0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
            // Traseira (0, 0, -1)
            0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1,
            // Superior (0, 1, 0)
            0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0,
            // Inferior (0, -1, 0)
            0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0,
            // Direita (1, 0, 0)
            1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,
            // Esquerda (-1, 0, 0)
            -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0,
        ]);

        this.vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

        this.normalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STATIC_DRAW);
    }

    bind(program) {
        const gl = this.gl;

        // 1. Posição (Usa this.vertexBuffer, não this.buffer)
        const positionLoc = gl.getAttribLocation(program, 'position');
        if (positionLoc !== -1) {
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer); // CORRIGIDO AQUI
            gl.vertexAttribPointer(positionLoc, 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(positionLoc);
        }

        // 2. Normal (Agora existe!)
        const normalLoc = gl.getAttribLocation(program, 'normal');
        if (normalLoc !== -1) {
            gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
            gl.vertexAttribPointer(normalLoc, 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(normalLoc);
        }

        // Nota: Removemos texture e color buffer antigo pois seu shader usa Uniform Color
    }

    draw() {
        // Usa drawArrays pois o cubo não usa buffer de índices (indexBuffer)
        this.gl.drawArrays(this.gl.TRIANGLES, 0, this.vertexCount);
    }
}
