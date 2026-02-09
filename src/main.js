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
import { Light, Spotlight } from './core/light.js';
import { Camera } from './core/camera.js';
import { CollisionSystem } from './systems/collision.js';
import { setupSceneColliders, ESCAPE_ROOM } from './scenes/environment.js';
import { MainMenu } from './menu/mainMenu.js';
import { Player } from './models/player.js';
import { InputHandler } from './core/input.js';
import { CamLight } from './models/camlight.js';
import AudioManager from './core/audio.js';

import * as mat4 from './math/mat4.js';

// --- CONFIGURAÇÃO DOS OBJETOS ---
// Sala 2: Aprox. Z entre 30 e 90.
// Sala 3: Aprox. Z entre 140 e 200, X negativo.

export const OBJECTS_TO_LOAD = [
    // --- PERSONAGENS / FIGURAS ---
    {
        id: 'alien',
        objPath: '../assets/models/Alien.obj',
        texPath: '../assets/textures/Alien_skin_gray.png',
        has_colision: true,
        colliderSize: [3.5, 12.0, 3.5], // Ajustado para a escala 8.0
        color: [0.0, 0.8, 0.5],
        position: [-55.0, -2.0, 180.0],
        rotation: [0, (3 * Math.PI) / 4, 0],
        scale: [8.0, 8.0, 8.0],
        material: { ka: 0.4, kd: 0.7, ks: [0.2, 0.2, 0.2], shininess: 10.0 },
    },
    {
        id: 'buddha',
        objPath: '../assets/models/buddha_lowpoly.obj',
        has_colision: true,
        colliderSize: [18.0, 32.0, 18.0], // Base larga para a escala 45.0
        texPath: '../assets/textures/buddha_lowpoly.png',
        color: [0.8, 0.7, 0.2],
        position: [15.0, -2.0, 80.0],
        rotation: [0, Math.PI, 0],
        scale: [45.0, 45.0, 45.0],
        material: { ka: 0.4, kd: 0.5, ks: [0.8, 0.6, 0.2], shininess: 30.0 },
    },

    // --- VEÍCULOS ---
    {
        id: 'police_car',
        objPath: '../assets/models/carPolice.obj',
        texPath: '../assets/textures/carPolice.png',
        has_colision: true,
        colliderSize: [12.0, 7.0, 24.0], // Carro longo na escala 24.0
        position: [-20.0, 4.0, 170.0],
        rotation: [Math.PI, -Math.PI / 6, 0],
        scale: [24.0, 24.0, 24.0],
        normalize: true,
        material: { ka: 0.4, kd: 0.7, ks: [1.0, 1.0, 1.0], shininess: 200.0 },
    },
    {
        id: 'ufo',
        objPath: '../assets/models/Low_poly_UFO.obj',
        texPath: '../assets/textures/ufo_diffuse.png',
        has_colision: true,
        colliderSize: [18.0, 5.0, 18.0], // Disco largo e achatado
        position: [-37.5, 8.0, 170.0],
        scale: [0.08, 0.08, 0.08],
        rotation: [Math.PI / 6, 0, 0],
        material: { ka: 0.6, kd: 0.8, ks: [0.5, 1.0, 1.0], shininess: 150.0 },
    },

    // --- MOBÍLIA ---
    {
        id: 'couch',
        objPath: '../assets/models/Couch.obj',
        texPath: '../assets/textures/Couch.png',
        has_colision: true,
        colliderSize: [12.0, 4.5, 5.0], // Sofá escala 4.0
        position: [-25.0, -2.0, 60.0],
        rotation: [0, 0, 0],
        scale: [4.0, 4.0, 4.0],
        material: { ka: 0.4, kd: 0.8, ks: [0.0, 0.0, 0.0], shininess: 1.0 },
    },
    {
        id: 'couchDiner',
        objPath: '../assets/models/CouchDiner.obj',
        texPath: '../assets/textures/CouchDiner.png',
        has_colision: true,
        colliderSize: [8.0, 5.0, 12.0], // Escala 12.0 com normalize
        position: [21.0, 0.0, 44.0],
        rotation: [0, -Math.PI / 2, 0],
        scale: [12, 12, 12],
        normalize: true,
        material: { ka: 0.4, kd: 0.8, ks: [0.3, 0.3, 0.3], shininess: 20.0 },
    },
    {
        id: 'old_tv',
        objPath: '../assets/models/old_tv.obj',
        texPath: '../assets/textures/old_tv.png',
        has_colision: true,
        colliderSize: [4.5, 4.5, 4.0], // TV CRT escala 8.0
        position: [-10.0, -2.0, 85.0],
        rotation: [0, 0, 0],
        scale: [8.0, 8.0, 8.0],
        material: { ka: 0.5, kd: 0.7, ks: [0.8, 0.8, 0.8], shininess: 64.0 },
    },

    // --- CAIXAS DE MADEIRA ---
    {
        id: 'wooden_box_stack1',
        objPath: '../assets/models/Wooden_box.obj',
        has_colision: true,
        colliderSize: [4.0, 4.0, 4.0],
        texPath: '../assets/textures/Wooden_box.png',
        position: [-55.0, 0.0, 160.0],
        scale: [3.5, 3.5, 3.5],
        material: { ka: 0.4, kd: 0.8, ks: [0.1, 0.1, 0.1], shininess: 5.0 },
    },
    {
        id: 'wooden_box_stack2',
        objPath: '../assets/models/Wooden_box.obj',
        texPath: '../assets/textures/Wooden_box.png',
        has_colision: true,
        colliderSize: [4.0, 4.0, 4.0],
        position: [-55.0, 4.0, 160.0],
        rotation: [0, Math.PI / 3, 0],
        scale: [3.5, 3.5, 3.5],
        material: { ka: 0.4, kd: 0.8, ks: [0.1, 0.1, 0.1], shininess: 5.0 },
    },
    {
        id: 'wooden_box_stack3',
        objPath: '../assets/models/Wooden_box.obj',
        texPath: '../assets/textures/Wooden_box.png',
        has_colision: true,
        colliderSize: [4.0, 4.0, 4.0],
        position: [-52.0, 0.0, 160.0],
        rotation: [0, Math.PI / 3, 0],
        scale: [3.5, 3.5, 3.5],
        material: { ka: 0.4, kd: 0.8, ks: [0.1, 0.1, 0.1], shininess: 5.0 },
    },

    // --- PROPS ---
    {
        id: 'flashlight',
        objPath: '../assets/models/flashlight_notexture.obj',
        texPath: null,
        has_colision: true,
        colliderSize: [1.2, 1.2, 3.0], 
        position: [-25.0, -1.0, 190.0],
        rotation: [0, Math.PI / 2.6, 0],
        scale: [2.5, 2.5, 2.5],
        color: [0.9, 0.2, 0.2],
        material: { ka: 0.4, kd: 0.5, ks: [1.0, 1.0, 1.0], shininess: 50.0 },
    },
    {
        id: 'can',
        has_colision: true,
        colliderSize: [0.8, 1.2, 0.8], // Latinhas precisam ser um pouco maiores que o modelo para o player sentir
        objPath: '../assets/models/can_crushed_lowpoly.obj',
        texPath: '../assets/textures/can_crushed_lowpoly_BaseColor_Opacity_2k.png',
        position: [-50.0, -2.0, 180.0],
        scale: [0.2, 0.2, 0.2],
        material: { ka: 0.4, kd: 0.8, ks: [1.0, 1.0, 1.0], shininess: 128.0 },
    },

    // --- ILUMINAÇÃO / POSTES ---
    {
        id: 'street_lamp_1',
        has_colision: true,
        colliderSize: [2.0, 20.0, 2.0], // Poste fino mas impossível de atravessar
        objPath: '../assets/models/street-lamp.obj',
        texPath: '../assets/textures/street-lamp.png',
        position: [-25.0, -2.0, 35.0],
        scale: [1.5, 1.5, 1.5],
        material: { ka: 0.4, kd: 0.5, ks: [0.5, 0.5, 0.5], shininess: 32.0 },
    },
    {
        id: 'trash_can',
        objPath: '../assets/models/TrashCan.obj',
        texPath: '../assets/textures/TrashCan.png',
        has_colision: true,
        colliderSize: [4.0, 7.0, 4.0], // Escala 9.0
        position: [22.0, -2.0, 60.0],
        rotation: [0, -Math.PI / 2, 0],
        scale: [9.0, 9.0, 9.0],
        material: { ka: 0.5, kd: 0.5, ks: [0.2, 0.2, 0.2], shininess: 40.0 },
    },
    {
        id: 'surgery_lamp',
        has_colision: true,
        colliderSize: [4.0, 10.0, 4.0],
        objPath: '../assets/models/SurgeryLamp.obj',
        texPath: '../assets/textures/SurgeryLamp.png',
        position: [-45.0, 0.0, 175.0],
        rotation: [0, -Math.PI / 4, 0],
        scale: [2.0, 2.0, 2.0],
        material: { ka: 0.4, kd: 0.8, ks: [0.9, 0.9, 0.9], shininess: 80.0 },
    },

    // --- BOTÕES (COLISÃO NA PAREDE) ---
    {
        id: 'emergency_button_1',
        objPath: '../assets/models/emergency_button.obj',
        has_colision: true,
        colliderSize: [1.5, 1.5, 1.5],
        texPath: '../assets/textures/emergency_button.png',
        position: [-22.0, 2.5, 70.0],
        rotation: [0, Math.PI / 2, Math.PI / 2],
        scale: [0.5, 0.5, 0.5],
        material: { ka: 0.3, kd: 0.8, ks: [0.5, 0.5, 0.5], shininess: 30.0 },
    }
];

class Game {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.gl = null;
        this.program = null;

        // Estado
        this.lastTime = 0;

        // Controle do loop
        this.running = false;
        this.rafId = null;

        // Objetos
        this.sceneObjects = []; // Array para guardar os objetos carregados

        // Dados Geométricos (Meshes)
        // Padronizamos os nomes: ufoMesh, canMesh, cubeMesh
        this.cubeMesh = null;

        // Texturas
        this.wallTexture = null;
        this.ceilingTexture = null;
        this.platformTexture = null;
        this.exitTexture = null;

        // Iluminação
        this.light = null;
        this.debugLight = false;

        // Câmera (movido para o constructor para poder acessar no draw)
        this.cameraPos = [0, 0, 8];
        this.fpsCamera = null;

        // Sistema de Colisão
        this.collisionSystem = null;

        // Player (representa o estado do jogador, como posição, rotação, etc.)
        this.player = new Player();

        this.input = new InputHandler();

        // Victory state
        this.victoryTriggered = false;
        this.victoryOverlay = null;

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
        const response = await fetch(url + '?t=' + Date.now()); // cache bust
        if (!response.ok) {
            throw new Error(`Failed to load shader: ${url} (${response.status})`);
        }
        return await response.text();
    }

    async init() {
        if (!this.initGL()) return;

        // Shaders
        const vShaderSrc = await this.loadShader('./assets/shaders/vertex.glsl');
        const fShaderSrc = await this.loadShader('./assets/shaders/fragment.glsl');
        const vertexShader = createShader(this.gl, this.gl.VERTEX_SHADER, vShaderSrc);
        const fragmentShader = createShader(this.gl, this.gl.FRAGMENT_SHADER, fShaderSrc);

        if (!vertexShader || !fragmentShader) {
            console.error('Failed to compile shaders');
            return;
        }

        this.program = createProgram(this.gl, vertexShader, fragmentShader);

        if (!this.program) {
            console.error('Failed to create shader program');
            return;
        }

        console.log('Shader program created successfully:', this.program);
        this.gl.useProgram(this.program);

        this.fpsCamera = new Camera(this.canvas, [0, 2, 8]);

        // Inicializar Sistema de Colisão
        this.collisionSystem = new CollisionSystem();

        // Inicializar Luz principal
        this.light = new Light(this.gl);
        this.light.color = [1.0, 0.95, 0.8];
        this.light.position = [5.0, 5.0, 2.0];

        this.camLights = []; // Note o plural

        // Câmera 1 (Sala 2 - Buddha)
        const cam1 = new CamLight([0.0, 12.0, 60.0]);
        cam1.light.color = [0.0, 1.5, 0.0]; // Ciano
        cam1.speed = 1.5; // Velocidade de oscilação
        this.camLights.push(cam1);

        // Câmera 2 (Sala 3 - Alien)
        const cam2 = new CamLight([-30.0, 10.0, 155.0], 20, 30);
        cam2.light.color = [1.5, 0.0, 0.0]; // Vermelha
        cam2.speed = 2.0; // Mais lenta
        this.camLights.push(cam2);

        // Câmera 3 (Sala 3 - Alien)
        const cam3 = new CamLight([-40.0, 12.0, 180.0], 20, 30);
        cam3.light.color = [0.0, 1.5, 0.0]; // Verde
        cam3.speed = 1.5; // Velocidade média
        this.camLights.push(cam3);

        this.spotlights = [
            new Spotlight([-25.0, 8.0, 35.0], [0.3, -1, 0], [1.0, 0.8, 0.5], 50, 100), // Street Lamp 1
            new Spotlight([25.0, 8.0, 85.0], [-0.3, -1, 0], [1.0, 0.8, 0.5], 50, 100), // Street Lamp 2
            new Spotlight([-25.0, -1.0, 192.0], [-1, 0, -0.7], [1.0, 1.0, 1.0], 20, 40), // Flashlight no chão
        ];

        // --- CARREGAMENTO ---
        // 1. Carrega os Assets "Hardcoded" antigos (pode manter ou remover se tudo estiver na lista)
        this.cubeMesh = createCubeMesh(this.gl);
        this.wallTexture = await loadTexture(this.gl, '../assets/textures/metal-wall1.jpg');
        this.wallTexture = await loadTexture(this.gl, '../assets/textures/metal-wall1.jpg');
        this.ceilingTexture = await loadTexture(this.gl, '../assets/textures/roof.jpeg');
        this.platformTexture = await loadTexture(this.gl, '../assets/textures/platform.jpeg');
        this.floorTexture = await loadTexture(this.gl, '../assets/textures/scifi_floor.png');
        this.exitTexture = await loadTexture(this.gl, '../assets/textures/exit.jpg');

        // Inicializar AudioManager e pré-carregar trilha
        this.audioManager = new AudioManager();
        this.audioManager
            .load('../assets/soundtrack.ogg')
            .catch((e) => console.warn('Falha ao carregar áudio:', e));

        // Carrega a lista de objetos
        await this.loadSceneObjects();

        // Configura colisoes e matrizes
        setupSceneColliders(this.collisionSystem);

        // Toggle building mode com tecla 'B'
        this.input.onBuildingModeToggle = () => this.player.toggleBuildingMode();

        window.addEventListener('keydown', (e) => {
            if (e.code === 'KeyL') {
                // Usa 'KeyL' para evitar problemas com CapsLock
                this.debugLight = !this.debugLight;
                console.log(`Luz de Editor: ${this.debugLight ? 'LIGADA' : 'DESLIGADA'}`);
            }
        });

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
            },
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
        // Tenta tocar a trilha já no menu; se o navegador bloquear, o clique no overlay fará resume/play
        try {
            this.audioManager.play();
        } catch (e) {
            /* ignore */
        }
        menuOverlay.addEventListener('click', async () => {
            try {
                await this.audioManager.resumeOnGesture();
                await this.audioManager.play();
            } catch (err) {
                /* ignore */
            }
        });

        setupSceneColliders(this.collisionSystem);

        // 2. Configura os modelos 3D que acabamos de carregar
        this.setupObjectColliders();

        // Referência ao overlay de vitória
        this.victoryOverlay = document.getElementById('victory-overlay');
    }

    setupObjectColliders() {
        this.sceneObjects.forEach(obj => {
            if (obj.has_colision) { 
                const size = obj.colliderSize || [obj.scale[0], obj.scale[1], obj.scale[2]];
                
                // Calculamos o centro real da caixa
                // Se o seu modelo cresce para cima a partir do pé (Y), 
                // o centro Y é a posição + metade da altura.
                const center = [
                    obj.position[0], 
                    obj.position[1] + size[1] / 2, 
                    obj.position[2]
                ];

                // Agora passamos exatamente os 2 argumentos que a classe espera
                this.collisionSystem.addBox(center, size);
                
                console.log(`Colisor ativado para: ${obj.id}`, { center, size });
            }
        });
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
                const shouldNormalize = conf.normalize || false;
                obj.mesh = await loadOBJModel(this, conf.objPath, shouldNormalize);
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
        const fov = 45; // em graus
        const aspect = this.canvas.width / this.canvas.height;

        this.projectionMatrix = mat4.createPerspective(fov, aspect, 0.1, 200.0);
    }

    update(dt) {
        this.checkGameOver();
        // Check for victory condition (on platform + Space key)
        const pos = this.player.position;
        if (!this.victoryTriggered && this.running) {
            const platformPos = [-37.5, -2.0 + 1.0, 230.0]; // FLOOR_POS_Y = -2.0
            const platformSize = [6.0, 2.0, 4.0];

            // Check if player is on platform (with some tolerance)
            const onPlatformX = Math.abs(pos[0] - platformPos[0]) < platformSize[0] / 2;
            const onPlatformZ = Math.abs(pos[2] - platformPos[2]) < platformSize[2] / 2;
            const onPlatformY =
                pos[1] >= platformPos[1] - 0.5 && pos[1] <= platformPos[1] + platformSize[1] + 1.0;

            if (onPlatformX && onPlatformZ && onPlatformY && this.input.isPressed('Space')) {
                this.triggerVictory();
                return; // Skip rest of update
            }
        }

        // Skip normal updates during victory sequence
        if (this.victoryTriggered) {
            // Continue falling animation
            this.player.position[1] -= 15 * dt; // Fast fall
            return;
        }

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
        const inEscape =
            pos[0] >= ESCAPE_ROOM.minX &&
            pos[0] <= ESCAPE_ROOM.maxX &&
            pos[2] >= ESCAPE_ROOM.minZ &&
            pos[2] <= ESCAPE_ROOM.maxZ;

        let targetColor;
        let targetPos;

        if (inEscape) {
            targetColor = [0.2, 1.3, 0.35]; // Verde Alien
        } else {
            targetColor = [1.0, 0.95, 0.8]; // Luz Quente
        }

        this.camLights.forEach((cam) => cam.update(dt));

        if (this.debugLight) {
            // MODO EDITOR: A luz segue o jogador (com offset para cima e à frente)
            targetPos = [pos[0], 10.0, pos[2] + 5.0];
        } else if (inEscape) {
            // MODO JOGO: Lógica normal
            targetPos = [-37.5, 6.0, 230.0];
        } else {
            return;
        }

        // Lerp suave (5% por frame)
        const lerpFactor = 0.05;
        this.light.color[0] += (targetColor[0] - this.light.color[0]) * lerpFactor;
        this.light.color[1] += (targetColor[1] - this.light.color[1]) * lerpFactor;
        this.light.color[2] += (targetColor[2] - this.light.color[2]) * lerpFactor;

        this.light.position[0] += (targetPos[0] - this.light.position[0]) * lerpFactor;
        this.light.position[1] += (targetPos[1] - this.light.position[1]) * lerpFactor;
        this.light.position[2] += (targetPos[2] - this.light.position[2]) * lerpFactor;
    }

    checkGameOver() {
        if (this.gameOver) return;

        this.camLights.forEach((cam) => {
            const lightPos = cam.light.position;
            const lightDir = mat4.normalize(cam.light.direction); // Usando sua mat4.js
            const playerPos = this.player.position;

            // Vetor da luz até o jogador usando sua função subtract
            const toPlayerNotNormalized = [
                playerPos[0] - lightPos[0],
                playerPos[1] - lightPos[1],
                playerPos[2] - lightPos[2],
            ];

            // Calculamos a distância para o limite de alcance
            const dist = Math.hypot(...toPlayerNotNormalized);

            if (dist < 25.0) {
                const toPlayerDir = mat4.normalize(toPlayerNotNormalized);

                // Produto escalar usando sua função dot
                const dotProduct = mat4.dot(toPlayerDir, lightDir);

                // Se o cosseno do ângulo for maior que o limite, está dentro do cone
                const detectionThreshold = Math.cos(0.5);

                if (dotProduct > detectionThreshold) {
                    console.log('⚠️ JOGADOR DETECTADO!');
                    this.triggerGameOver();
                }
            }
        });
    }

    triggerGameOver() {
        if (this.gameOver) return; // Evita disparar múltiplas vezes
        this.gameOver = true;
        this.stopLoop();

        // 1. Feedback visual
        const overlay = document.getElementById('menu-overlay');
        overlay.style.display = 'flex';
        overlay.innerHTML = `
            <div style="text-align: center; color: red;">
                <h1>VOCÊ FOI PEGO!</h1>
                <p>A segurança da nave te encontrou.</p>
                <p style="color: white; font-size: 0.8em;">Pressione <strong>ENTER</strong> para reiniciar</p>
                <button onclick="location.reload()" style="padding: 10px 20px; cursor: pointer; margin-top: 10px;">Tentar Novamente</button>
            </div>
        `;

        // 2. Solta o mouse
        if (document.pointerLockElement) {
            document.exitPointerLock();
        }

        // 3. Escuta a tecla ENTER para reiniciar
        const handleRestart = (event) => {
            if (event.key === 'Enter') {
                document.removeEventListener('keydown', handleRestart); // Limpa o evento
                location.reload(); // Recarrega o jogo
            }
        };

        document.addEventListener('keydown', handleRestart);
    }

    draw() {
        const gl = this.gl;

        if (!this.program) {
            console.error('Cannot draw: shader program not initialized');
            return;
        }

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
        this.updateSpotlights();

        // --- 4. Desenha os objetos ---
        drawEnvironment(this);
        drawCube(this);
        drawSceneObjects(this);
    }

    updateSpotlights() {
        const gl = this.gl;

        // Arrays para enviar ao Shader
        const allPos = [];
        const allDir = [];
        const allCol = [];
        const allInner = [];
        const allOuter = [];

        // Lista temporária unificando tudo que brilha como spotlight
        const allSources = [];

        // Adiciona os Spotlights normais (Flashlight, Street Lamps)
        this.spotlights.forEach((s) => allSources.push(s));

        // Adiciona as CamLights (Câmeras de Segurança)
        // Adaptamos os dados, pois CamLight pode não ter cutoffs definidos
        this.camLights.forEach((cam) => {
            // Usa os valores da câmera ou define padrão (30° ~ 40°) se não existirem
            const inner = cam.light.innerCutoff || Math.cos((30 * Math.PI) / 180);
            const outer = cam.light.outerCutoff || Math.cos((40 * Math.PI) / 180);

            allSources.push({
                position: cam.light.position,
                direction: cam.light.direction,
                color: cam.light.color,
                innerCutoff: inner,
                outerCutoff: outer,
            });
        });

        // Preenche os arrays lineares para o WebGL
        const limit = Math.min(allSources.length, 8);

        for (let i = 0; i < limit; i++) {
            const s = allSources[i];
            allPos.push(...s.position);
            allDir.push(...s.direction);
            allCol.push(...s.color);
            allInner.push(s.innerCutoff);
            allOuter.push(s.outerCutoff);
        }
        gl.uniform3fv(gl.getUniformLocation(this.program, 'uSpotPos'), new Float32Array(allPos));
        gl.uniform3fv(gl.getUniformLocation(this.program, 'uSpotDir'), new Float32Array(allDir));
        gl.uniform3fv(gl.getUniformLocation(this.program, 'uSpotColor'), new Float32Array(allCol));
        gl.uniform1fv(
            gl.getUniformLocation(this.program, 'uInnerCutoff'),
            new Float32Array(allInner),
        );
        gl.uniform1fv(
            gl.getUniformLocation(this.program, 'uOuterCutoff'),
            new Float32Array(allOuter),
        );
    }

    triggerVictory() {
        this.victoryTriggered = true;
        console.log('VITÓRIA! Gabrielzito escapou!');

        // Disable collisions for fall animation
        this.player.isBuildingMode = true; // Reuse fly mode to disable collisions

        // Show victory overlay after a brief delay
        setTimeout(() => {
            if (this.victoryOverlay) {
                this.victoryOverlay.classList.add('show');
            }

            // Optionally stop audio
            if (this.audioManager) {
                this.audioManager.stop();
            }

            // Add Enter key listener to return to menu
            const handleEnter = (e) => {
                if (e.key === 'Enter') {
                    window.removeEventListener('keydown', handleEnter);
                    location.reload();
                }
            };
            window.addEventListener('keydown', handleEnter);
        }, 1000);
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
