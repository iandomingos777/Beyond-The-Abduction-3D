import { getGL } from './core/glContext.js';
import { createShader, createProgram } from './core/shaderUtils.js';
import { createCubeMesh } from './geometries/cube.js';
import { loadOBJModel } from './core/objLoader.js';
import { drawCrushedCan, drawCube, drawUFO, drawEnvironment } from './core/draw.js';
import { loadTexture } from './core/textureLoader.js';
import { Light } from './core/light.js';
import { Camera } from './core/camera.js';
import { CollisionSystem } from './systems/collision.js';
import { setupSceneColliders } from './scenes/environment.js';

import * as mat4 from './math/mat4.js';

class Game {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.gl = null;
        this.program = null;

        // Estado
        this.lastTime = 0;
        this.cubeRotation = 0;
        this.ufoRotation = 0;
        this.canRotation = 0;

        // Dados Geométricos (Meshes)
        // Padronizamos os nomes: ufoMesh, canMesh, cubeMesh
        this.cubeMesh = null;
        this.ufoMesh = {};
        this.canMesh = {};

        // Texturas
        this.crushedCanTexture = null;
        this.ufoTexture = null;
        this.wallTexture = null;

        // Iluminação
        this.light = null;

        // Câmera (movido para o constructor para poder acessar no draw)
        this.cameraPos = [0, 0, 8];
        this.fpsCamera = null;

        // Sistema de Colisão
        this.collisionSystem = null;

        // Matrizes
        this.modelMatrix = mat4.identityMatrix();
        this.viewMatrix = mat4.identityMatrix();
        this.projectionMatrix = mat4.identityMatrix();
    }

    // ... (Mantenha initGL e loadShader iguais) ...
    initGL() {
        this.gl = getGL(this.canvas);
        if (!this.gl) return false;
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        this.gl.clearColor(0.1, 0.1, 0.15, 1.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.BLEND);
        this.gl.enable(this.gl.CULL_FACE);
        return true;
    }

    async loadShader(url) {
        const response = await fetch(url);
        return await response.text();
    }

    async init() {
        if (!this.initGL()) return;

        // Shaders
        const vShaderSrc = await this.loadShader('./assets/shaders/vertex.glsl');
        const fShaderSrc = await this.loadShader('./assets/shaders/fragment.glsl');
        this.program = createProgram(
            this.gl,
            createShader(this.gl, this.gl.VERTEX_SHADER, vShaderSrc),
            createShader(this.gl, this.gl.FRAGMENT_SHADER, fShaderSrc),
        );
        this.gl.useProgram(this.program);

        this.fpsCamera = new Camera(this.canvas, [0, 2, 8]);

        // Inicializar Sistema de Colisão
        this.collisionSystem = new CollisionSystem();
        this.fpsCamera.setCollisionSystem(this.collisionSystem);

        // Inicializar Luz
        this.light = new Light(this.gl);
        // Exemplo: Mudar a cor da luz para levemente amarelada
        // Pode ser removido no futuro
        this.light.color = [1.0, 0.95, 0.8];
        this.light.position = [5.0, 5.0, 5.0];

        // Carregar assets

        // Carrega a textura em paralelo com os modelos
        this.crushedCanTexture = await loadTexture(
            this.gl,
            '../assets/textures/can_crushed_lowpoly_BaseColor_Opacity_2k.png',
        );
        this.ufoTexture = await loadTexture(this.gl, '../assets/textures/ufo_diffuse.png');
        this.wallTexture = await loadTexture(this.gl, '../assets/textures/metal-wall1.jpg');

        this.cubeMesh = createCubeMesh(this.gl);

        // Carregar OBJs
        this.ufoMesh = await loadOBJModel(this, '../assets/models/Low_poly_UFO.obj');
        this.canMesh = await loadOBJModel(this, '../assets/models/can_crushed_lowpoly.obj');

        // Configurar colisores do ambiente
        setupSceneColliders(this.collisionSystem);

        this.setupMatrices();
        requestAnimationFrame((t) => this.loop(t));
    }

    setupMatrices() {
        const fov = 45; // em graus (teu createPerspective espera graus)
        const aspect = this.canvas.width / this.canvas.height;

        this.projectionMatrix = mat4.createPerspective(fov, aspect, 0.1, 200.0);

        // this.viewMatrix = mat4.createCamera(
        //     [0, 0, 8], // posição da câmera
        //     [0, 0, 0], // target
        //     [0, 1, 0], // up
        // );
    }

    update(dt) {
        if (this.fpsCamera) {
            this.fpsCamera.update(dt);
        }
        this.cubeRotation += dt * 1.5;
        this.ufoRotation += dt * 0.5;
        this.canRotation += dt * 0.8;
    }

    draw() {
        const gl = this.gl;
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // --- 1. Atualiza Câmera ---
        // Pega a matriz de visão baseada no mouse/teclado
        this.viewMatrix = this.fpsCamera.getViewMatrix();
        // Envia a posição da câmera para o shader (brilho especular)
        const uViewPos = gl.getUniformLocation(this.program, 'uViewPos');
        gl.uniform3fv(uViewPos, this.fpsCamera.position);
        // --- 2. Atualiza Luzes ---
        this.light.updateUniforms(gl, this.program);
        // --- 3. Envia Matrizes para a GPU ---
        const uView = gl.getUniformLocation(this.program, 'uViewMatrix');
        const uProj = gl.getUniformLocation(this.program, 'uProjectionMatrix');

        gl.uniformMatrix4fv(uView, false, this.viewMatrix);
        gl.uniformMatrix4fv(uProj, false, this.projectionMatrix);

        // --- 4. Desenha os objetos ---
        drawEnvironment(this);
        drawUFO(this);
        drawCube(this);
        drawCrushedCan(this);
    }

    loop(timestamp) {
        const dt = (timestamp - this.lastTime) / 1000;
        this.lastTime = timestamp;
        this.update(dt);
        this.draw();
        requestAnimationFrame((t) => this.loop(t));
    }
}

window.addEventListener('DOMContentLoaded', () => {
    new Game('glcanvas1').init();
});
