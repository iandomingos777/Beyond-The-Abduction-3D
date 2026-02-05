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

    // Lógica da Normal
    // Se o mesh tem normais, mandamos. Se não (ex: debug lines), desativamos.
    const normLoc = gl.getAttribLocation(program, 'normal');
    if (normLoc !== -1 && meshData.normalBuffer) {
        gl.bindBuffer(gl.ARRAY_BUFFER, meshData.normalBuffer);
        gl.vertexAttribPointer(normLoc, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(normLoc);
    } else if (normLoc !== -1) {
        // Se não tiver buffer de normal, desabilita ou alimenta um valor padrão
        gl.disableVertexAttribArray(normLoc);
        gl.vertexAttrib3f(normLoc, 0.0, 1.0, 0.0); // Normal genérica para cima
    }

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

    let model = mat4.identityMatrix();

    // 1. POSIÇÃO: Move para onde o objeto deve estar no mundo
    model = mat4.translate(model, -3.5, 2.0, 0.0);

    // 2. ROTAÇÃO: Gira no próprio eixo (sem cx, cy, cz!)
    model = mat4.rotateX(model, game.cubeRotation);
    model = mat4.rotateY(model, game.cubeRotation);

    // 3. TAMANHO: Escala por último
    model = mat4.scale(model, 0.5, 0.5, 0.5);

    drawGenericMesh(game.gl, game.program, model, game.cubeMesh, [1.0, 1.0, 1.0]);
}
export function drawUFO(game) {
    if (!game.ufoMesh.positionBuffer) return;

    let model = mat4.identityMatrix();

    // Translação
    model = mat4.translate(model, 0.0, -2.0, 0.0);

    // Escala
    model = mat4.scale(model, 0.05, 0.05, 0.05);

    // Rotação no próprio eixo do UFO
    const cx = 0.0,
        cy = -2.0,
        cz = 0.0;
    model = mat4.rotateY(model, game.ufoRotation, cx, cy, cz);

    drawGenericMesh(game.gl, game.program, model, game.ufoMesh, [1.0, 1.0, 1.0], game.ufoTexture);
}

export function drawCrushedCan(game) {
    if (!game.canMesh.positionBuffer) return;

    let model = mat4.identityMatrix();

    // Translação
    model = mat4.translate(model, 3.0, 2.0, 0.0);

    // Escala
    model = mat4.scale(model, 0.05, 0.05, 0.05);

    // Rotação em torno do próprio eixo
    const cx = 3.0,
        cy = 2.0,
        cz = 0.0;
    model = mat4.rotateZ(model, Math.PI / 2, cx, cy, cz);
    model = mat4.rotateY(model, game.canRotation, cx, cy, cz);

    drawGenericMesh(
        game.gl,
        game.program,
        model,
        game.canMesh,
        [1.0, 1.0, 1.0],
        game.crushedCanTexture,
    );
}
