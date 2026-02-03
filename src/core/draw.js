/**
 * Função genérica para desenhar qualquer modelo OBJ carregado
 * @param {WebGLRenderingContext} gl - Contexto WebGL
 * @param {WebGLProgram} program - O shader program
 * @param {Float32Array} modelMatrix - Matriz de transformação do objeto atual
 * @param {Object} modelData - Objeto contendo {positionBuffer, indexBuffer, count}
 * @param {Array} color - Array [r, g, b] opcional para cor sólida
 */
function drawGenericMesh(gl, program, modelMatrix, meshData, color) {
    // 1. Uniformes de Matriz e Cor
    const uModel = gl.getUniformLocation(program, 'uModelMatrix');
    const uColorLoc = gl.getUniformLocation(program, 'uColor');

    gl.uniformMatrix4fv(uModel, false, modelMatrix);
    gl.uniform3fv(uColorLoc, color); // Cor RGB [r, g, b]

    // 2. Atributo de Posição
    const posLoc = gl.getAttribLocation(program, 'position');
    if (posLoc !== -1) {
        gl.bindBuffer(gl.ARRAY_BUFFER, meshData.positionBuffer);
        gl.vertexAttribPointer(posLoc, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(posLoc);
    }

    // 3. Desenho (Indexado)
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, meshData.indexBuffer);
    gl.drawElements(gl.TRIANGLES, meshData.count, gl.UNSIGNED_SHORT, 0);
}

// --- Funções do Jogo ---

export function drawCube(game) {
    if (!game.cubeMesh) return;

    mat4.identity(game.modelMatrix);
    mat4.translate(game.modelMatrix, game.modelMatrix, [-3.5, 2.0, 0.0]);
    mat4.scale(game.modelMatrix, game.modelMatrix, [0.5, 0.5, 0.5]);
    mat4.rotateX(game.modelMatrix, game.modelMatrix, game.cubeRotation);
    mat4.rotateY(game.modelMatrix, game.modelMatrix, game.cubeRotation);

    // Agora o cubo usa a mesma lógica que o resto!
    drawGenericMesh(game.gl, game.program, game.modelMatrix, game.cubeMesh, [0.0, 0.5, 1.0]);
}

export function drawUFO(game) {
    if (!game.ufoMesh.positionBuffer) return;

    mat4.identity(game.modelMatrix);
    mat4.translate(game.modelMatrix, game.modelMatrix, [0.0, -2.0, 0.0]);
    mat4.scale(game.modelMatrix, game.modelMatrix, [0.05, 0.05, 0.05]);
    mat4.rotateY(game.modelMatrix, game.modelMatrix, game.ufoRotation);

    drawGenericMesh(game.gl, game.program, game.modelMatrix, game.ufoMesh, [0.6, 1.0, 0.6]);
}

export function drawCrushedCan(game) {
    if (!game.canMesh.positionBuffer) return;

    mat4.identity(game.modelMatrix);
    mat4.translate(game.modelMatrix, game.modelMatrix, [3, 2, 0.0]);
    mat4.scale(game.modelMatrix, game.modelMatrix, [0.05, 0.05, 0.05]);
    mat4.rotateZ(game.modelMatrix, game.modelMatrix, Math.PI / 2);
    mat4.rotateY(game.modelMatrix, game.modelMatrix, game.canRotation);

    drawGenericMesh(game.gl, game.program, game.modelMatrix, game.canMesh, [1.0, 0.5, 0.5]);
}
