export function createCubeMesh(gl) {
    // 1. Posições (8 vértices de um cubo simples, ou 24 se quisermos texturas separadas depois)
    // Para simplificar e garantir compatibilidade futura (texturas/normais flat),
    // vamos usar 24 vértices (4 por face).
    const vertices = new Float32Array([
        // Frente (Z+)
        -0.5, -0.5, 0.5, 0.5, -0.5, 0.5, 0.5, 0.5, 0.5, -0.5, 0.5, 0.5,
        // Trás (Z-)
        -0.5, -0.5, -0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5, 0.5, -0.5, -0.5,
        // Topo (Y+)
        -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, -0.5,
        // Base (Y-)
        -0.5, -0.5, -0.5, 0.5, -0.5, -0.5, 0.5, -0.5, 0.5, -0.5, -0.5, 0.5,
        // Direita (X+)
        0.5, -0.5, -0.5, 0.5, 0.5, -0.5, 0.5, 0.5, 0.5, 0.5, -0.5, 0.5,
        // Esquerda (X-)
        -0.5, -0.5, -0.5, -0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5, 0.5, -0.5,
    ]);

    // Coordenadas de Textura (UV)
    // Cada face tem 4 vértices: (0,0), (1,0), (1,1), (0,1)
    const texCoords = new Float32Array([
        // Frente
        0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
        // Trás
        0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
        // Topo
        0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
        // Base
        0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
        // Direita
        0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
        // Esquerda
        0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
    ]);

    // 2. Índices (Como conectar os pontos para formar triângulos)
    const indices = new Uint16Array([
        // Frente
        0, 1, 2, 0, 2, 3,
        // Trás
        4, 5, 6, 4, 6, 7,
        // Topo
        8, 9, 10, 8, 10, 11,
        // Base
        12, 13, 14, 12, 14, 15,
        // Direita
        16, 17, 18, 16, 18, 19,
        // Esquerda
        20, 21, 22, 20, 22, 23,
    ]);

    // Criar Buffers
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    // Criar Buffer Textura
    const texCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, texCoords, gl.STATIC_DRAW);

    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    // Retorna o mesmo formato que o OBJLoader
    return {
        positionBuffer: positionBuffer,
        texCoordBuffer: texCoordBuffer,
        indexBuffer: indexBuffer,
        count: indices.length,
    };
}
