import { SCENE_GEOMETRY } from '../scenes/environment.js';
import { computeNormalMatrixFromMat4 } from '../core/shaderUtils.js';

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

    // --- NORMAL MATRIX (inverse-transpose do modelMatrix) ---
    const uNormalMatrixLoc = gl.getUniformLocation(program, 'uNormalMatrix');
    if (uNormalMatrixLoc) {
        const normalMatrix = computeNormalMatrixFromMat4(modelMatrix);
        gl.uniformMatrix3fv(uNormalMatrixLoc, false, normalMatrix);
    }

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
    model = mat4.translate(model, 0.0, 0.0, 0.0);
    // Escala
    model = mat4.scale(model, 0.05, 0.05, 0.05);
    // Rotação no próprio eixo do UFO
    const cx = 0.0,
        cy = 0.0,
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
    model = mat4.translate(model, 5, 0.0, 0.0);
    // Escala
    model = mat4.scale(model, 0.1, 0.1, 0.1);

    // Rotação em torno do próprio eixo
    const cx = 5,
        cy = 0.0,
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
function drawBox(game, position, scale, color, elemType, elemMaterial) {
    if (!game.cubeMesh) return;
    let model = mat4.identityMatrix();

    // 1. Posição (x, y, z)
    model = mat4.translate(model, position[0], position[1], position[2]);
    // 2. Escala (largura, altura, profundidade)
    model = mat4.scale(model, scale[0], scale[1], scale[2]);

    // Material padrão (fosco para paredes/chão)
    const defaultMat = {
        ka: 0.5,
        kd: 0.9,
        ks: [0.3, 0.3, 0.3],
        shininess: 40.0,
    };
    const material = elemMaterial ? { ...defaultMat, ...elemMaterial } : defaultMat;

    // Textura: paredes e chão usam wallTexture; tetos usam ceilingTexture
    // Plataforma NÃO usa textura aqui (será aplicada manualmente apenas no topo)
    let texture = null;
    if (elemType === 'wall') {
        texture = game.wallTexture;
    } else if (elemType === 'ceiling') {
        texture = game.ceilingTexture;
    } else if (elemType === 'floor') {
        texture = game.floorTexture;
    } else if (elemType === 'exit') {
        texture = game.exitTexture;
    }
    // Para plataforma, não definimos textura aqui (renderiza cor sólida)

    drawGenericMesh(game.gl, game.program, model, game.cubeMesh, color, texture, material);
}

export function drawEnvironment(game) {
    // Desenha todos os elementos definidos em SCENE_GEOMETRY
    SCENE_GEOMETRY.forEach((elem) => {
        // Para plataformas, desenha o corpo sem textura e depois a face superior com textura
        if (elem.type === 'platform') {
            // 1. Desenha o cubo completo sem textura (cor sólida)
            drawBox(game, elem.position, elem.size, elem.color, elem.type, elem.material);

            // 2. Desenha apenas a face superior com textura (quad fino no topo)
            const topY = elem.position[1] + elem.size[1] / 2 + 0.01; // Ligeiramente acima para evitar z-fighting
            drawPlatformTop(
                game,
                [elem.position[0], topY, elem.position[2]],
                [elem.size[0], elem.size[2]],
            );
        } else {
            drawBox(game, elem.position, elem.size, elem.color, elem.type, elem.material);
        }
    });
}

/**
 * Desenha apenas a face superior de uma plataforma com textura
 */
function drawPlatformTop(game, position, size) {
    if (!game.cubeMesh || !game.platformTexture) return;

    let model = mat4.identityMatrix();
    // Posiciona no topo da plataforma
    model = mat4.translate(model, position[0], position[1], position[2]);
    // Escala: largura e profundidade da plataforma, altura mínima para face plana
    model = mat4.scale(model, size[0], 0.001, size[1]);

    const material = {
        ka: 0.5,
        kd: 0.8,
        ks: [0.3, 0.3, 0.3],
        shininess: 50.0,
    };

    drawGenericMesh(
        game.gl,
        game.program,
        model,
        game.cubeMesh,
        [1.0, 1.0, 1.0],
        game.platformTexture,
        material,
    );
}

/**
 * Renderiza a lista de objetos dinâmicos do jogo
 */
export function drawSceneObjects(game) {
    if (!game.sceneObjects || game.sceneObjects.length === 0) return;

    game.sceneObjects.forEach((obj) => {
        // Pula se a malha (mesh) ainda não carregou
        if (!obj.mesh || !obj.mesh.positionBuffer) return;

        let model = mat4.identityMatrix();

        // 1. Translação
        model = mat4.translate(model, obj.position[0], obj.position[1], obj.position[2]);

        // 2. Rotação (Z -> Y -> X)
        if (obj.rotation) {
            if (obj.rotation[2]) model = mat4.rotateZ(model, obj.rotation[2]);
            if (obj.rotation[1]) model = mat4.rotateY(model, obj.rotation[1]);
            if (obj.rotation[0]) model = mat4.rotateX(model, obj.rotation[0]);
        }

        // 3. Escala
        if (obj.scale) {
            model = mat4.scale(model, obj.scale[0], obj.scale[1], obj.scale[2]);
        }

        // Material padrão (se não definido no config)
        const material = obj.material || {
            ka: 0.3,
            kd: 0.8,
            ks: [0.3, 0.3, 0.3],
            shininess: 32.0,
        };

        // Cor padrão (Branco se tiver textura, Cinza se não tiver)
        const defaultColor = obj.texture ? [1.0, 1.0, 1.0] : [0.7, 0.7, 0.7];
        const color = obj.color || defaultColor;

        drawGenericMesh(
            game.gl,
            game.program,
            model,
            obj.mesh,
            color,
            obj.texture, // Passa null se não existir
            material,
        );
    });
}
