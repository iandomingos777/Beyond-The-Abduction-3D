import { getGL } from './core/glContext.js';
import { createShader, createProgram } from './core/shaderUtils.js';
import { createCubeMesh } from './geometries/cube.js';
import { loadOBJModel } from './core/objLoader.js';
import { drawCrushedCan, drawCube, drawUFO, drawEnvironment } from './core/draw.js';
import { loadTexture } from './core/textureLoader.js';
import { Light } from './core/light.js';
import { Camera } from './core/camera.js';
import { CollisionSystem } from './systems/collision.js';
import { setupSceneColliders, ESCAPE_ROOM } from './scenes/environment.js';
import { MainMenu } from './menu/mainMenu.js';
import { Player } from './models/player.js';
import { InputHandler } from './core/input.js';

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

        // Controle do loop
        this.running = false;
        this.rafId = null;

        // Dados Geométricos (Meshes)
        // Padronizamos os nomes: ufoMesh, canMesh, cubeMesh
        this.cubeMesh = null;
        this.ufoMesh = {};
        this.canMesh = {};

        // Texturas
        this.crushedCanTexture = null;
        this.ufoTexture = null;
        this.wallTexture = null;
        this.ceilingTexture = null;
        this.platformTexture = null;

        // Iluminação
        this.light = null;

        // Câmera (movido para o constructor para poder acessar no draw)
        this.cameraPos = [0, 0, 8];
        this.fpsCamera = null;

        // Sistema de Colisão
        this.collisionSystem = null;

        // Player (representa o estado do jogador, como posição, rotação, etc.)
        this.player = new Player();

        this.input = new InputHandler();

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
        

        // Inicializar Luz principal
        this.light = new Light(this.gl);
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
        this.ceilingTexture = await loadTexture(this.gl, '../assets/textures/roof.jpeg');
        this.platformTexture = await loadTexture(this.gl, '../assets/textures/platform.jpeg');

        this.cubeMesh = createCubeMesh(this.gl);

        // Carregar OBJs
        this.ufoMesh = await loadOBJModel(this, '../assets/models/Low_poly_UFO.obj');
        this.canMesh = await loadOBJModel(this, '../assets/models/can_crushed_lowpoly.obj');

        // Configurar colisores do ambiente
        setupSceneColliders(this.collisionSystem);

        // Toggle building mode com tecla 'B'
        this.input.onBuildingModeToggle = () => this.player.toggleBuildingMode();

        this.setupMatrices();

        // Pointer lock ao clicar no canvas (só ativa durante gameplay)
        this.canvas.addEventListener('click', () => {
            if (this.running) {
                this.canvas.requestPointerLock();
            }
        });

        // Exibe o menu principal antes de iniciar o loop
        const menuOverlay = document.getElementById('menu-overlay');
        this.menu = new MainMenu(menuOverlay, {
            onPlay: () => {
                this.startLoop();
            }
        });
        // Callback: ESC durante gameplay → pausa e volta ao menu
        this.menu.onPause = () => {
            this.stopLoop();
            if (document.pointerLockElement) {
                document.exitPointerLock();
            }
            this.input.consumeMouseDelta(); // Limpa delta acumulado
        };
        this.menu.show();
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
    // 1. Captura inputs do mouse
    const mouse = this.input.consumeMouseDelta();
    
    // 2. Rotaciona e move o player
    this.player.applyRotation(mouse.x, mouse.y);
    this.player.update(dt, this.input, this.collisionSystem);

    // 3. A câmera apenas "segue" o player
    this.fpsCamera.position = this.player.getEyePosition();
    this.fpsCamera.yaw = this.player.yaw;
    this.fpsCamera.pitch = this.player.pitch;
    this.fpsCamera._updateVectors();

    // 4. Zona da sala de fuga → luz verde alienígena (com transição suave)
    const pos = this.player.position;
    const inEscape = pos[0] >= ESCAPE_ROOM.minX && pos[0] <= ESCAPE_ROOM.maxX
                  && pos[2] >= ESCAPE_ROOM.minZ && pos[2] <= ESCAPE_ROOM.maxZ;
    
    const targetColor = inEscape ? [0.2, 1.3, 0.35] : [1.0, 0.95, 0.8]; // Luz mais forte no escape room
    const targetPos = inEscape ? [-37.5, 6.0, 230.0] : [pos[0], 10.0, pos[2] + 5.0]; // Posicionar luz na plataforma
    
    // Lerp suave (5% por frame)
    const lerpFactor = 0.05;
    this.light.color[0] += (targetColor[0] - this.light.color[0]) * lerpFactor;
    this.light.color[1] += (targetColor[1] - this.light.color[1]) * lerpFactor;
    this.light.color[2] += (targetColor[2] - this.light.color[2]) * lerpFactor;
    
    this.light.position[0] += (targetPos[0] - this.light.position[0]) * lerpFactor;
    this.light.position[1] += (targetPos[1] - this.light.position[1]) * lerpFactor;
    this.light.position[2] += (targetPos[2] - this.light.position[2]) * lerpFactor;
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

    startLoop() {
        if (this.running) return;
        this.running = true;
        this.lastTime = performance.now();
        this.rafId = requestAnimationFrame((t) => this.loop(t));
    }

    stopLoop() {
        this.running = false;
        if (this.rafId) {
            cancelAnimationFrame(this.rafId);
            this.rafId = null;
        }
    }

    loop(timestamp) {
        if (!this.running) return;
        const dt = (timestamp - this.lastTime) / 1000;
        this.lastTime = timestamp;
        this.update(dt);
        this.draw();
        this.rafId = requestAnimationFrame((t) => this.loop(t));
    }
}

window.addEventListener('DOMContentLoaded', () => {
    new Game('glcanvas1').init();
});
