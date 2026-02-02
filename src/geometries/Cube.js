// Geometria de um cubo simples
// Cada face do cubo tem sua própria cor para visualização

export class Cube {
    constructor(gl) {
        this.gl = gl;
        this.vertexBuffer = null;
        this.colorBuffer = null;
        this.vertexCount = 36; // 6 faces * 2 triângulos * 3 vértices
        
        this.createBuffers();
    }

    createBuffers() {
        const gl = this.gl;

        // Posições dos vértices do cubo (X, Y, Z)
        // Cada face precisa de 6 vértices (2 triângulos)
        const vertices = new Float32Array([
            // Face frontal (Z+)
            -0.5, -0.5,  0.5,
             0.5, -0.5,  0.5,
             0.5,  0.5,  0.5,
            -0.5, -0.5,  0.5,
             0.5,  0.5,  0.5,
            -0.5,  0.5,  0.5,

            // Face traseira (Z-)
            -0.5, -0.5, -0.5,
            -0.5,  0.5, -0.5,
             0.5,  0.5, -0.5,
            -0.5, -0.5, -0.5,
             0.5,  0.5, -0.5,
             0.5, -0.5, -0.5,

            // Face superior (Y+)
            -0.5,  0.5, -0.5,
            -0.5,  0.5,  0.5,
             0.5,  0.5,  0.5,
            -0.5,  0.5, -0.5,
             0.5,  0.5,  0.5,
             0.5,  0.5, -0.5,

            // Face inferior (Y-)
            -0.5, -0.5, -0.5,
             0.5, -0.5, -0.5,
             0.5, -0.5,  0.5,
            -0.5, -0.5, -0.5,
             0.5, -0.5,  0.5,
            -0.5, -0.5,  0.5,

            // Face direita (X+)
             0.5, -0.5, -0.5,
             0.5,  0.5, -0.5,
             0.5,  0.5,  0.5,
             0.5, -0.5, -0.5,
             0.5,  0.5,  0.5,
             0.5, -0.5,  0.5,

            // Face esquerda (X-)
            -0.5, -0.5, -0.5,
            -0.5, -0.5,  0.5,
            -0.5,  0.5,  0.5,
            -0.5, -0.5, -0.5,
            -0.5,  0.5,  0.5,
            -0.5,  0.5, -0.5
        ]);

        // Cores para cada vértice (R, G, B, A)
        const colors = new Float32Array([
            // Frontal - Vermelho
            1.0, 0.0, 0.0, 1.0,
            1.0, 0.0, 0.0, 1.0,
            1.0, 0.0, 0.0, 1.0,
            1.0, 0.0, 0.0, 1.0,
            1.0, 0.0, 0.0, 1.0,
            1.0, 0.0, 0.0, 1.0,

            // Traseira - Ciano
            0.0, 1.0, 1.0, 1.0,
            0.0, 1.0, 1.0, 1.0,
            0.0, 1.0, 1.0, 1.0,
            0.0, 1.0, 1.0, 1.0,
            0.0, 1.0, 1.0, 1.0,
            0.0, 1.0, 1.0, 1.0,

            // Superior - Verde
            0.0, 1.0, 0.0, 1.0,
            0.0, 1.0, 0.0, 1.0,
            0.0, 1.0, 0.0, 1.0,
            0.0, 1.0, 0.0, 1.0,
            0.0, 1.0, 0.0, 1.0,
            0.0, 1.0, 0.0, 1.0,

            // Inferior - Magenta
            1.0, 0.0, 1.0, 1.0,
            1.0, 0.0, 1.0, 1.0,
            1.0, 0.0, 1.0, 1.0,
            1.0, 0.0, 1.0, 1.0,
            1.0, 0.0, 1.0, 1.0,
            1.0, 0.0, 1.0, 1.0,

            // Direita - Azul
            0.0, 0.0, 1.0, 1.0,
            0.0, 0.0, 1.0, 1.0,
            0.0, 0.0, 1.0, 1.0,
            0.0, 0.0, 1.0, 1.0,
            0.0, 0.0, 1.0, 1.0,
            0.0, 0.0, 1.0, 1.0,

            // Esquerda - Amarelo
            1.0, 1.0, 0.0, 1.0,
            1.0, 1.0, 0.0, 1.0,
            1.0, 1.0, 0.0, 1.0,
            1.0, 1.0, 0.0, 1.0,
            1.0, 1.0, 0.0, 1.0,
            1.0, 1.0, 0.0, 1.0
        ]);

        // Criar buffer de vértices
        this.vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

        // Criar buffer de cores
        this.colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
    }

    bind(program) {
        const gl = this.gl;

        // Bind vértices
        const positionLocation = gl.getAttribLocation(program, 'position');
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(positionLocation);

        // Bind cores
        const colorLocation = gl.getAttribLocation(program, 'color');
        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
        gl.vertexAttribPointer(colorLocation, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(colorLocation);
    }

    draw() {
        this.gl.drawArrays(this.gl.TRIANGLES, 0, this.vertexCount);
    }
}
