/**
 * Função genérica para desenhar qualquer modelo OBJ carregado
 * @param {WebGLRenderingContext} gl - Contexto WebGL
 * @param {WebGLProgram} program - O shader program
 * @param {Float32Array} modelMatrix - Matriz de transformação do objeto atual
 * @param {Object} modelData - Objeto contendo {positionBuffer, indexBuffer, count}
 * @param {Array} color - Array [r, g, b] opcional para cor sólida
 */
function drawGenericOBJ(gl, program, modelMatrix, modelData, color = [1.0, 1.0, 1.0]) {
    // 1. Uniforme de Modelo
    const uModel = gl.getUniformLocation(program, 'uModelMatrix');
    gl.uniformMatrix4fv(uModel, false, modelMatrix);

    // Enviar Uniformes de Iluminação e Cor ---

    // Cor do Objeto (uColor)
    const uColorLoc = gl.getUniformLocation(program, 'uColor');
    gl.uniform3fv(uColorLoc, color); // Envia [r, g, b]

    // Posição da Luz (uLightPos) - Vamos fixar uma luz no topo/frente por enquanto
    // NOTE: TEMPORÁRIO
    const uLightLoc = gl.getUniformLocation(program, 'uLightPos');
    gl.uniform3f(uLightLoc, 10.0, 10.0, 10.0); // Luz na posição (10, 10, 10)

    // 2. Atributos (Posição, Normal, etc...)
    const posLoc = gl.getAttribLocation(program, 'position');
    if (posLoc !== -1) {
        gl.bindBuffer(gl.ARRAY_BUFFER, modelData.positionBuffer);
        gl.vertexAttribPointer(posLoc, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(posLoc);
    }

    // Atributo de Normal (Essencial para Phong)
    const normalLoc = gl.getAttribLocation(program, 'normal');
    if (normalLoc !== -1 && modelData.normalBuffer) {
        gl.bindBuffer(gl.ARRAY_BUFFER, modelData.normalBuffer);
        gl.vertexAttribPointer(normalLoc, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(normalLoc);
    }

    // Atributo de Textura (Opcional, seu shader atual NEM TEM isso, então vai ignorar)
    const texLoc = gl.getAttribLocation(program, 'texCoord');
    if (texLoc !== -1 && modelData.texCoordBuffer) {
        gl.bindBuffer(gl.ARRAY_BUFFER, modelData.texCoordBuffer);
        gl.vertexAttribPointer(texLoc, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(texLoc);
    }

    // Desenhar
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, modelData.indexBuffer);
    gl.drawElements(gl.TRIANGLES, modelData.count, gl.UNSIGNED_SHORT, 0);
}
// --- Funções Específicas do Jogo ---

export function drawCube(game) {
    const gl = game.gl;

    mat4.identity(game.modelMatrix);
    mat4.translate(game.modelMatrix, game.modelMatrix, [-3.5, 2.0, 0.0]);
    mat4.scale(game.modelMatrix, game.modelMatrix, [0.5, 0.5, 0.5]);
    mat4.rotateX(game.modelMatrix, game.modelMatrix, game.cubeRotation);
    mat4.rotateY(game.modelMatrix, game.modelMatrix, game.cubeRotation);

    const uModel = gl.getUniformLocation(game.program, 'uModelMatrix');
    gl.uniformMatrix4fv(uModel, false, game.modelMatrix);
    const uColorLoc = gl.getUniformLocation(game.program, 'uColor');
    gl.uniform3f(uColorLoc, 0.0, 0.5, 1.0); // Cubo Azul
    // NOTE: TEMPORÁRIO
    const uLightLoc = gl.getUniformLocation(game.program, 'uLightPos');
    gl.uniform3f(uLightLoc, 10.0, 10.0, 10.0);

    game.cube.bind(game.program);
    game.cube.draw();
}
export function drawUFO(game) {
    // Verificação de segurança: só desenha se os dados existirem
    if (!game.ufoData.positionBuffer) return;

    // 1. Lógica do UFO: Calcular ONDE ele está
    mat4.identity(game.modelMatrix);
    mat4.translate(game.modelMatrix, game.modelMatrix, [0.0, -2.0, 0.0]);
    mat4.scale(game.modelMatrix, game.modelMatrix, [0.05, 0.05, 0.05]);
    mat4.rotateY(game.modelMatrix, game.modelMatrix, game.ufoRotation);

    // 2. Chama a função genérica para desenhar
    // Passamos o contexto, o shader, a matriz calculada acima, os dados do UFO e a cor (Verde Claro)
    drawGenericOBJ(game.gl, game.program, game.modelMatrix, game.ufoData, [0.6, 1.0, 0.6]);
}

export function drawCrushedCan(game) {
    if (!game.canData.positionBuffer) return;

    mat4.identity(game.modelMatrix);
    mat4.translate(game.modelMatrix, game.modelMatrix, [3, 2, 0.0]);
    mat4.scale(game.modelMatrix, game.modelMatrix, [0.05, 0.05, 0.05]);
    mat4.rotateZ(game.modelMatrix, game.modelMatrix, Math.PI / 2);
    mat4.rotateY(game.modelMatrix, game.modelMatrix, game.canRotation);
    drawGenericOBJ(game.gl, game.program, game.modelMatrix, game.canData, [1.0, 0.5, 0.5]);
}
