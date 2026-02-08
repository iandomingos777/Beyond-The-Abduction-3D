import { getGL } from './core/glContext.js';
import { createShader, createProgram } from './core/shaderUtils.js';
import { createCubeMesh } from './geometries/cube.js';
import { loadOBJModel } from './core/objLoader.js';
import {
    drawCrushedCan,
    drawCube,
    drawUFO,
    drawEnvironment,
    drawSceneObjects,
} from './core/draw.js';
import { loadTexture } from './core/textureLoader.js';
import { Light } from './core/light.js';
import { Camera } from './core/camera.js';
import { CollisionSystem } from './systems/collision.js';
import { setupSceneColliders } from './scenes/environment.js';
import { MainMenu } from './menu/mainMenu.js';
import { Player } from './models/player.js';
import { InputHandler } from './core/input.js';

import * as mat4 from './math/mat4.js';

// --- CONFIGURAÇÃO DOS OBJETOS ---
// Sala 2: Aprox. Z entre 30 e 90.
// Sala 3: Aprox. Z entre 140 e 200, X negativo.
const OBJECTS_TO_LOAD = [
    // --- PERSONAGENS / FIGURAS ---
    {
        id: 'alien',
        objPath: '../assets/models/Alien.obj',
        texPath: '../assets/textures/Alien_skin_gray.png',
        color: [0.0, 0.8, 0.5], // verde escurecido
        // Sala 3 (Escondido no fundo)
        position: [-50.0, 0.0, 180.0],
        rotation: [0, Math.PI / 4, 0], // Virado para o centro
        scale: [1.0, 1.0, 1.0],
        material: {
            ka: 0.4,
            kd: 0.6,
            ks: [0.2, 0.2, 0.2],
            shininess: 10.0, // Pele: brilho baixo e espalhado
        },
    },
    {
        id: 'buddha',
        objPath: '../assets/models/buddha_lowpoly.obj',
        texPath: '../assets/textures/buddha_lowpoly.png',
        // Sala 2 (Centro, como uma estátua)
        position: [0.0, 0.0, 60.0],
        scale: [5.0, 5.0, 5.0],
        material: {
            ka: 0.5,
            kd: 0.5,
            ks: [1.0, 0.8, 0.2],
            shininess: 100.0, // Ouro/Bronze: Brilho forte e amarelado
        },
    },

    // --- VEÍCULOS ---
    {
        id: 'police_car',
        objPath: '../assets/models/carPolice.obj',
        texPath: '../assets/textures/carPolice.png',
        // Sala 2 (Estacionado no canto)
        position: [15.0, 0.0, 50.0],
        rotation: [0, -Math.PI / 6, 0],
        scale: [1.0, 1.0, 1.0],
        material: {
            ka: 0.3,
            kd: 0.7,
            ks: [1.0, 1.0, 1.0],
            shininess: 200.0, // Lataria: Muito brilhante e polido
        },
    },
    {
        id: 'ufo',
        objPath: '../assets/models/Low_poly_UFO.obj',
        texPath: '../assets/textures/ufo_diffuse.png',
        // Sala 3 (Flutuando alto no centro da sala final)
        position: [-37.5, 8.0, 170.0],
        scale: [0.08, 0.08, 0.08],
        rotation: [Math.PI / 6, 0, 0], // Levemente inclinado
        material: {
            ka: 0.8,
            kd: 0.8,
            ks: [0.5, 1.0, 1.0],
            shininess: 150.0, // Sci-fi: Brilho ciano/metálico
        },
    },

    // --- MOBÍLIA ---
    {
        id: 'couch',
        objPath: '../assets/models/Couch.obj',
        texPath: '../assets/textures/Couch.png',
        // Sala 2 (Área de estar)
        position: [-15.0, 0.0, 60.0],
        rotation: [0, Math.PI / 2, 0],
        scale: [1.0, 1.0, 1.0],
        material: {
            ka: 0.6,
            kd: 0.8,
            ks: [0.0, 0.0, 0.0],
            shininess: 1.0, // Tecido: Quase sem brilho especular
        },
    },
    {
        id: 'couchDiner',
        objPath: '../assets/models/CouchDiner.obj',
        texPath: '../assets/textures/CouchDiner.png',
        // Sala 2 (De frente pro outro sofá)
        position: [-15.0, 0.0, 70.0],
        rotation: [0, -Math.PI / 2, 0],
        scale: [1.0, 1.0, 1.0],
        material: {
            ka: 0.5,
            kd: 0.8,
            ks: [0.3, 0.3, 0.3],
            shininess: 20.0, // Couro/Vinil: Brilho leve
        },
    },
    {
        id: 'old_tv',
        objPath: '../assets/models/old_tv.obj',
        texPath: '../assets/textures/old_tv.png',
        // Sala 2 (Perto dos sofás, no chão ou flutuando levemente)
        position: [-10.0, 0.5, 65.0],
        rotation: [0, Math.PI, 0],
        scale: [1.0, 1.0, 1.0],
        material: {
            ka: 0.5,
            kd: 0.7,
            ks: [0.8, 0.8, 0.8],
            shininess: 64.0, // Plástico/Vidro: Brilho médio
        },
    },
    {
        id: 'wooden_box_stack1',
        objPath: '../assets/models/Wooden_box.obj',
        texPath: '../assets/textures/Wooden_box.png',
        // Sala 3 (Empilhada no canto)
        position: [-55.0, 0.0, 160.0],
        scale: [1.5, 1.5, 1.5],
        material: {
            ka: 0.7,
            kd: 0.8,
            ks: [0.1, 0.1, 0.1],
            shininess: 5.0, // Madeira: Fosco
        },
    },
    {
        id: 'wooden_box_stack2', // Segunda caixa
        objPath: '../assets/models/Wooden_box.obj',
        texPath: '../assets/textures/Wooden_box.png',
        // Sala 3 (Em cima da primeira)
        position: [-55.0, 3.0, 160.0],
        rotation: [0, Math.PI / 3, 0],
        scale: [1.2, 1.2, 1.2],
        material: { ka: 0.7, kd: 0.8, ks: [0.1, 0.1, 0.1], shininess: 5.0 },
    },

    // --- ITENS PEQUENOS / PROPS ---
    {
        id: 'flashlight',
        objPath: '../assets/models/flashlight_notexture.obj',
        texPath: null,
        // Corredor chegando na Sala 2
        position: [0.0, 0.2, 40.0],
        rotation: [0, Math.PI / 4, 0],
        scale: [1.0, 1.0, 1.0],
        color: [0.2, 0.2, 0.2], // Cinza escuro
        material: { ka: 0.5, kd: 0.5, ks: [1.0, 1.0, 1.0], shininess: 50.0 },
    },
    {
        id: 'food',
        objPath: '../assets/models/Food1.obj',
        texPath: '../assets/textures/Food1.png',
        // Sala 2 (Em cima do sofá ou chão perto)
        position: [-15.0, 1.0, 60.0],
        scale: [0.5, 0.5, 0.5],
        material: { ka: 0.8, kd: 0.8, ks: [0.2, 0.2, 0.2], shininess: 10.0 },
    },
    {
        id: 'can_extra',
        objPath: '../assets/models/can_crushed_lowpoly.obj',
        texPath: '../assets/textures/can_crushed_lowpoly_BaseColor_Opacity_2k.png',
        // Sala 3 (Lixo no chão)
        position: [-30.0, 0.2, 180.0],
        scale: [0.1, 0.1, 0.1],
        material: { ka: 0.5, kd: 0.8, ks: [1.0, 1.0, 1.0], shininess: 128.0 }, // Metal
    },

    // --- EQUIPAMENTOS / LUZES ---
    {
        id: 'street_lamp_1',
        objPath: '../assets/models/street-lamp.obj',
        texPath: '../assets/textures/street-lamp.png',
        // Sala 2 (Canto esquerdo)
        position: [-25.0, 0.0, 35.0],
        scale: [1.5, 1.5, 1.5],
        material: { ka: 0.5, kd: 0.5, ks: [0.5, 0.5, 0.5], shininess: 32.0 },
    },
    {
        id: 'street_lamp_2',
        objPath: '../assets/models/street-lamp.obj',
        texPath: '../assets/textures/street-lamp.png',
        // Sala 2 (Canto direito oposto)
        position: [25.0, 0.0, 85.0],
        rotation: [0, Math.PI, 0],
        scale: [1.5, 1.5, 1.5],
        material: { ka: 0.5, kd: 0.5, ks: [0.5, 0.5, 0.5], shininess: 32.0 },
    },
    {
        id: 'surgery_lamp',
        objPath: '../assets/models/SurgeryLamp.obj',
        texPath: '../assets/textures/SurgeryLamp.png',
        // Sala 3 (Perto do Alien)
        position: [-45.0, 0.0, 175.0],
        rotation: [0, -Math.PI / 4, 0],
        scale: [1.2, 1.2, 1.2],
        material: {
            ka: 0.7,
            kd: 0.8,
            ks: [0.9, 0.9, 0.9],
            shininess: 80.0, // Metal hospitalar limpo
        },
    },
    {
        id: 'emergency_button',
        objPath: '../assets/models/emergency_button.obj',
        texPath: '../assets/textures/emergency_button.png',
        // Corredor final (Parede antes da Sala 3)
        // Ajuste fino: X=-22.5 é a parede, movi um pouco pra dentro
        position: [-22.0, 2.5, 135.0],
        rotation: [0, 0, Math.PI / 2], // Rotacionado pra "colar" na parede vertical
        scale: [0.5, 0.5, 0.5],
        material: { ka: 0.8, kd: 0.8, ks: [0.5, 0.5, 0.5], shininess: 30.0 },
    },
    {
        id: 'trash_can',
        objPath: '../assets/models/TrashCan.obj',
        texPath: '../assets/textures/TrashCan.png',
        // Sala 2 (Perto da saída pro corredor)
        position: [15.0, 0.0, 95.0],
        scale: [1.2, 1.2, 1.2],
        material: { ka: 0.4, kd: 0.5, ks: [0.2, 0.2, 0.2], shininess: 20.0 },
    },
];

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

        // Objetos
        this.sceneObjects = []; // Array para guardar os objetos carregados

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

        // Inicializar Luz
        this.light = new Light(this.gl);
        // Exemplo: Mudar a cor da luz para levemente amarelada
        // Pode ser removido no futuro
        this.light.color = [1.0, 0.95, 0.8];
        this.light.position = [5.0, 5.0, 5.0];

        // --- CARREGAMENTO ---
        // 1. Carrega os Assets "Hardcoded" antigos (pode manter ou remover se tudo estiver na lista)
        this.cubeMesh = createCubeMesh(this.gl);
        this.wallTexture = await loadTexture(this.gl, '../assets/textures/metal-wall1.jpg');
        // (Opcional: mantenha ufoMesh e canMesh antigos se quiser compatibilidade com código velho)
        this.ufoMesh = await loadOBJModel(this, '../assets/models/Low_poly_UFO.obj');
        this.ufoTexture = await loadTexture(this.gl, '../assets/textures/ufo_diffuse.png');
        this.canMesh = await loadOBJModel(this, '../assets/models/can_crushed_lowpoly.obj');
        this.crushedCanTexture = await loadTexture(
            this.gl,
            '../assets/textures/can_crushed_lowpoly_BaseColor_Opacity_2k.png',
        );

        // 2. Carrega a NOVA LISTA de Objetos
        await this.loadSceneObjects();

        // Configura colisoes e matrizes
        setupSceneColliders(this.collisionSystem);
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
                this.fpsCamera.allowActivation = true;
                this.startLoop();
            },
        });
        // Callback: ESC durante gameplay → pausa e volta ao menu
        this.menu.onPause = () => {
            this.stopLoop();
            this.fpsCamera.toggle(false);
        };
        this.menu.show();
    }

    async loadSceneObjects() {
        console.log('Carregando objetos da lista...');

        const promises = OBJECTS_TO_LOAD.map(async (conf) => {
            const obj = {
                ...conf, // Copia id, position, scale, etc.
                mesh: null,
                texture: null,
            };

            // Carregar OBJ
            try {
                // Tenta carregar. Se falhar, usa o cubo de debug.
                obj.mesh = await loadOBJModel(this, conf.objPath);
            } catch (e) {
                console.error(`Erro OBJ ${conf.id}:`, e);
                obj.mesh = this.cubeMesh; // Fallback visual
            }

            // Carregar Textura
            if (conf.texPath) {
                try {
                    obj.texture = await loadTexture(this.gl, conf.texPath);
                } catch (e) {
                    console.warn(`Textura não carregou para ${conf.id}. Usando cor sólida.`);
                }
            }
            return obj;
        });

        this.sceneObjects = await Promise.all(promises);
        console.log('Objetos carregados:', this.sceneObjects);
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
        // --- DESENHAR NOVOS OBJETOS ---
        drawSceneObjects(this);
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
