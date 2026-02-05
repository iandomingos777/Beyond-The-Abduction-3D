/**
 * Função genérica para desenhar qualquer modelo OBJ carregado
 * @param {WebGLRenderingContext} gl - Contexto WebGL
 * @param {WebGLProgram} program - O shader program
 * @param {Float32Array} modelMatrix - Matriz de transformação do objeto atual
 * @param {Object} modelData - Objeto contendo {positionBuffer, indexBuffer, count}
 * @param {Array} color - Array [r, g, b] opcional para cor sólida
 * @param {WebGLTexture} texture - Textura opcional para aplicar ao modelo
 * * @param {Object} material - Configuração { ka, kd, ks, shininess }
 */

import * as mat4 from '../math/mat4.js';

function drawGenericMesh(gl, program, modelMatrix, meshData, color, texture = null, material = {}) {
    // 1. Uniformes de Matriz e Cor
    const uModel = gl.getUniformLocation(program, 'uModelMatrix');
    const uColorLoc = gl.getUniformLocation(program, 'uColor');
    const uUseTexture = gl.getUniformLocation(program, 'uUseTexture'); // Flag
    const uSampler = gl.getUniformLocation(program, 'uSampler');

    // Valores padrão
    const matDefaults = {
        ka: 1.0, // Responde 100% à luz ambiente
        kd: 1.0, // Responde 100% à luz difusa
        ks: [1.0, 1.0, 1.0], // Brilho especular branco
        shininess: 32.0, // Brilho padrão
    };
    const finalMat = { ...matDefaults, ...material };

    gl.uniformMatrix4fv(uModel, false, modelMatrix);
    gl.uniform3fv(uColorLoc, color); // Cor RGB [r, g, b]

    // Envia uniforms de material
    const uKa = gl.getUniformLocation(program, 'uKa');
    const uKd = gl.getUniformLocation(program, 'uKd');
    const uKs = gl.getUniformLocation(program, 'uKs');
    const uShininess = gl.getUniformLocation(program, 'uShininess');

    gl.uniform1f(uKa, finalMat.ka);
    gl.uniform1f(uKd, finalMat.kd);
    gl.uniform3fv(uKs, finalMat.ks);
    gl.uniform1f(uShininess, finalMat.shininess);

    // Lógica da normal
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

    // Lógica da textura
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

    // POSIÇÃO: Move para onde o objeto deve estar no mundo
    model = mat4.translate(model, -3.5, 2.0, 0.0);
    // ROTAÇÃO: Gira no próprio eixo (sem cx, cy, cz!)
    model = mat4.rotateX(model, game.cubeRotation);
    model = mat4.rotateY(model, game.cubeRotation);
    // TAMANHO: Escala por último
    model = mat4.scale(model, 0.5, 0.5, 0.5);

    // Definição do Material
    const material = {
        ka: 0.5, // Ambiente médio
        kd: 0.8, // Difusa alta
        ks: [0.3, 0.3, 0.3], // Especular cinza escuro (pouco brilho)
        shininess: 30.0, // Brilho espalhado (plástico)
    };

    drawGenericMesh(game.gl, game.program, model, game.cubeMesh, [1.0, 1.0, 1.0], null, material);
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

    const material = {
        ka: 0.25, // Pouco ambiente
        kd: 0.6, // Difusa média
        ks: [0.1, 0.1, 0.1], // Especular médio e cinza
        shininess: 10.0, // Brilho muito concentrado (polido)
    };

    drawGenericMesh(
        game.gl,
        game.program,
        model,
        game.ufoMesh,
        [1.0, 1.0, 1.0],
        game.ufoTexture,
        material,
    );
}

export function drawCrushedCan(game) {
    if (!game.canMesh.positionBuffer) return;
    let model = mat4.identityMatrix();

    // Translação
    model = mat4.translate(model, 3.0, 2.0, 0.0);
    // Escala
    model = mat4.scale(model, 0.1, 0.1, 0.1);

    // Rotação em torno do próprio eixo
    const cx = 3.0,
        cy = 2.0,
        cz = 0.0;
    model = mat4.rotateZ(model, Math.PI / 2, cx, cy, cz);
    model = mat4.rotateY(model, game.canRotation, cx, cy, cz);

    // Material Metálico
    const material = {
        ka: 0.2, // Metal reflete pouco ambiente difuso
        kd: 0.5, // Difusa média
        ks: [1.0, 1.0, 1.0], // Especular muito forte e branco
        shininess: 128.0, // Brilho muito concentrado (polido)
    };

    drawGenericMesh(
        game.gl,
        game.program,
        model,
        game.canMesh,
        [1.0, 1.0, 1.0],
        game.crushedCanTexture,
    );
}

/**
 * Desenha uma caixa (box) esticada a partir do mesh de cubo padrão.
 * @param {Object} game - Objeto do jogo contendo contexto WebGL, programa e mesh do cubo
 * @param {Array} position - Vetor [x, y, z] para posição da caixa
 * @param {Array} scale - Vetor [sx, sy, sz] para escala da caixa
 * @param {Array} color - Vetor [r, g, b] para cor sólida da caixa
 */
function drawBox(game, position, scale, color) {
    if (!game.cubeMesh) return;
    let model = mat4.identityMatrix();

    // 1. Posição (x, y, z)
    model = mat4.translate(model, position[0], position[1], position[2]);
    // 2. Escala (largura, altura, profundidade)
    model = mat4.scale(model, scale[0], scale[1], scale[2]);

    // Material simples (fosco para paredes/chão)
    const material = {
        ka: 0.4,
        kd: 0.6,
        ks: [0.1, 0.1, 0.1],
        shininess: 10.0,
    };

    drawGenericMesh(
        game.gl,
        game.program,
        model,
        game.cubeMesh,
        color,
        null, // Sem textura por enquanto (ou passe game.envTexture se quiser)
        material,
    );
}

export function drawEnvironment(game) {
    // Cores (RGB)
    const corChao = [0.4, 0.4, 0.9]; // Cinza azulado
    const corParede = [0.7, 0.7, 0.7]; // Cinza claro
    const corTeto = [0.2, 0.2, 0.2]; // Escuro (opcional)

    // --- SALA PRINCIPAL (10x10) ---
    // Nota: O cubeMesh padrão costuma ter tamanho 2 (-1 a 1).
    // Então scale 5.0 gera tamanho 10.

    // 1. Chão da Sala (Centro em 0,0,0)
    // Posição: y = -2.0 (para ficar abaixo dos objetos)
    drawBox(game, [0, -2.0, 0], [10.0, 0.1, 10.0], corChao);
    // 2. Parede Fundos
    drawBox(game, [0, 0, -10.0], [10.0, 2.0, 0.5], corParede);
    // 3. Parede Esquerda
    drawBox(game, [-10.0, 0, 0], [0.5, 2.0, 10.0], corParede);
    // 4. Parede Direita
    drawBox(game, [10.0, 0, 0], [0.5, 2.0, 10.0], corParede);

    // --- CORREDOR (Saindo da frente da sala) ---
    // Vamos fazer um corredor no eixo Z positivo

    // 1. Chão do Corredor (Mais estreito, largura 4)
    // Começa no Z=10 (borda da sala) e vai até Z=30
    drawBox(game, [0, -2.0, 20.0], [4.0, 0.1, 10.0], corChao);
    // 2. Parede Esquerda do Corredor
    drawBox(game, [-4.0, 0, 20.0], [0.5, 2.0, 10.0], corParede);
    // 3. Parede Direita do Corredor
    drawBox(game, [4.0, 0, 20.0], [0.5, 2.0, 10.0], corParede);
}
