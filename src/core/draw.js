/**
 * Função genérica para desenhar qualquer modelo OBJ carregado
 * @param {WebGLRenderingContext} gl - Contexto WebGL
 * @param {WebGLProgram} program - O shader program
 * @param {Float32Array} modelMatrix - Matriz de transformação do objeto atual
 * @param {Object} modelData - Objeto contendo {positionBuffer, indexBuffer, count}
 * @param {Array} color - Array [r, g, b] opcional para cor sólida
 * @param {WebGLTexture} texture - Textura opcional para aplicar ao modelo
 */

import * as mat4 from '../math/mat4.js';

function drawGenericMesh(gl, program, modelMatrix, meshData, color, texture = null) {
    // 1. Uniformes de Matriz e Cor
    const uModel = gl.getUniformLocation(program, 'uModelMatrix');
    const uColorLoc = gl.getUniformLocation(program, 'uColor');
    const uUseTexture = gl.getUniformLocation(program, 'uUseTexture'); // Flag
    const uSampler = gl.getUniformLocation(program, 'uSampler');

    gl.uniformMatrix4fv(uModel, false, modelMatrix);
    gl.uniform3fv(uColorLoc, color); // Cor RGB [r, g, b]

    // Lógica da Textura
    if (texture && meshData.texCoordBuffer) {
        gl.uniform1i(uUseTexture, true); // Ativa modo textura no shader

        // Bind Texture
        gl.activeTexture(gl.TEXTURE0); // Ativa unidade 0
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.uniform1i(uSampler, 0); // Diz ao shader que a textura está na unidade 0

        // Bind Atributo de Coordenada UV
        const texLoc = gl.getAttribLocation(program, 'texCoord');
        if (texLoc !== -1) {
            gl.bindBuffer(gl.ARRAY_BUFFER, meshData.texCoordBuffer);
            gl.vertexAttribPointer(texLoc, 2, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(texLoc);
        }
    } else {
        gl.uniform1i(uUseTexture, false); // Desativa modo textura (apenas cor)

        // É bom desabilitar o array se não for usar, para evitar warnings
        const texLoc = gl.getAttribLocation(program, 'texCoord');
        if (texLoc !== -1) gl.disableVertexAttribArray(texLoc);
    }

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

    // Começa com identidade
    let model = mat4.identity();

    // Translação para posição no mundo
    model = mat4.translate(model, -3.5, 2.0, 0.0);

    // Escala
    model = mat4.scale(model, 0.5, 0.5, 0.5);

    // Rotação no próprio eixo do cubo (passando o centro como ponto de rotação)
    const cx = -3.5, cy = 2.0, cz = 0.0;
    model = mat4.rotateX(model, game.cubeRotation, cx, cy, cz);
    model = mat4.rotateY(model, game.cubeRotation, cx, cy, cz);

    drawGenericMesh(game.gl, game.program, model, game.cubeMesh, [1.0, 1.0, 1.0]);
}
export function drawUFO(game) {
    if (!game.ufoMesh.positionBuffer) return;

    let model = mat4.identity();

    // Translação
    model = mat4.translate(model, 0.0, -2.0, 0.0);

    // Escala
    model = mat4.scale(model, 0.05, 0.05, 0.05);

    // Rotação no próprio eixo do UFO
    const cx = 0.0, cy = -2.0, cz = 0.0;
    model = mat4.rotateY(model, game.ufoRotation, cx, cy, cz);

    drawGenericMesh(game.gl, game.program, model, game.ufoMesh, [0.6, 1.0, 0.6]);
}

export function drawCrushedCan(game) {
    if (!game.canMesh.positionBuffer) return;

    let model = mat4.identity();

    // Translação
    model = mat4.translate(model, 3.0, 2.0, 0.0);

    // Escala
    model = mat4.scale(model, 0.05, 0.05, 0.05);

    // Rotação em torno do próprio eixo
    const cx = 3.0, cy = 2.0, cz = 0.0;
    model = mat4.rotateZ(model, Math.PI / 2, cx, cy, cz);
    model = mat4.rotateY(model, game.canRotation, cx, cy, cz);

    drawGenericMesh(game.gl, game.program, model, game.canMesh, [1.0, 1.0, 1.0], game.crushedCanTexture);
}
