import { getGL } from './core/glContext.js';
import { createShader, createProgram } from './core/shaderUtils.js';
import { Cube } from './geometries/Cube.js';
import { OBJLoader } from './core/objLoader.js';
import { drawCrushedCan, drawCube, drawUFO } from './core/draw.js';

class Game {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.gl = null;

        // Estado do jogo
        this.lastTime = 0;
        this.cubeRotation = 0;
        this.ufoRotation = 0;
        this.canRotation = 0;

        // Shader Program
        this.program = null;

        // Geometria
        this.cube = null;

        // Dados do UFO (Buffers e contagem)
        this.ufoData = {
            positionBuffer: null,
            indexBuffer: null,
            count: 0,
        };
        // Dados da Lata (Buffers e contagem)
        this.canData = {
            positionBuffer: null,
            indexBuffer: null,
            count: 0,
        };

        // Matrizes
        this.modelMatrix = mat4.create();
        this.viewMatrix = mat4.create();
        this.projectionMatrix = mat4.create();
    }

    initGL() {
        this.gl = getGL(this.canvas);
        if (!this.gl) return false;

        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        this.gl.clearColor(0.1, 0.1, 0.15, 1.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        // Adicione esta linha temporariamente:
        this.gl.disable(this.gl.CULL_FACE);
        return true;
    }

    async loadShader(url) {
        const response = await fetch(url);
        return await response.text();
    }

    async init() {
        if (!this.initGL()) {
            console.error('Falha ao inicializar WebGL');
            return;
        }

        // 1. Carregar Shaders
        const vShaderSrc = await this.loadShader('./assets/shaders/vertex.glsl');
        const fShaderSrc = await this.loadShader('./assets/shaders/fragment.glsl');
        const vertexShader = createShader(this.gl, this.gl.VERTEX_SHADER, vShaderSrc);
        const fragmentShader = createShader(this.gl, this.gl.FRAGMENT_SHADER, fShaderSrc);
        this.program = createProgram(this.gl, vertexShader, fragmentShader);
        this.gl.useProgram(this.program);

        // 2. Setup do Cubo
        this.cube = new Cube(this.gl);

        // 3. Setup do UFO (.obj)
        // NOTA: Verifique se o caminho é '../assets' ou './assets' dependendo de onde está seu index.html
        this.ufoData = await this.loadOBJModel('../assets/models/Low_poly_UFO.obj');
        this.canData = await this.loadOBJModel('../assets/models/can_crushed_lowpoly.obj');

        // 4. Configurar Câmera
        this.setupMatrices();

        // 5. Iniciar Loop
        requestAnimationFrame((t) => this.loop(t));
    }

    async loadOBJModel(path) {
        const loader = new OBJLoader();
        const modelData = await loader.load(path);

        const gl = this.gl;

        // Objeto que conterá todos os buffers desta malha 3D
        const mesh = {
            positionBuffer: null,
            normalBuffer: null, // Adicionado para Iluminação (Phong)
            texCoordBuffer: null, // Adicionado para Texturas
            indexBuffer: null,
            count: 0,
        };

        // 1. Buffer de Posições (Vértices)
        mesh.positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, mesh.positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, modelData.vertices, gl.STATIC_DRAW);

        // 2. Buffer de Normais (Necessário para a Iluminação de Phong)
        if (modelData.normals && modelData.normals.length > 0) {
            mesh.normalBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, mesh.normalBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, modelData.normals, gl.STATIC_DRAW);
        }

        // 3. Buffer de Textura (UVs)
        if (modelData.texCoords && modelData.texCoords.length > 0) {
            mesh.texCoordBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, mesh.texCoordBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, modelData.texCoords, gl.STATIC_DRAW);
        }

        // 4. Buffer de Índices
        mesh.indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, modelData.indices, gl.STATIC_DRAW);

        mesh.count = modelData.indices.length;

        return mesh; // Retorna o objeto pronto para uso
    }

    setupMatrices() {
        const fov = (45 * Math.PI) / 180;
        const aspect = this.canvas.width / this.canvas.height;
        mat4.perspective(this.projectionMatrix, fov, aspect, 0.1, 100.0);

        const eye = [0, 0, 8]; // Afastei um pouco a câmera (z=8) para ver melhor
        const center = [0, 0, 0];
        const up = [0, 1, 0];
        mat4.lookAt(this.viewMatrix, eye, center, up);
    }

    update(dt) {
        this.cubeRotation += dt * 1.5; // Rotação rápida
        this.ufoRotation += dt * 0.5; // Rotação lenta
        this.canRotation += dt * 0.8; // Rotação média
    }

    draw() {
        const gl = this.gl;
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // Atualiza as matrizes globais (View e Projection são constantes por frame neste caso)
        const uView = gl.getUniformLocation(this.program, 'uViewMatrix');
        const uProj = gl.getUniformLocation(this.program, 'uProjectionMatrix');
        gl.uniformMatrix4fv(uView, false, this.viewMatrix);
        gl.uniformMatrix4fv(uProj, false, this.projectionMatrix);

        // Renderiza cada objeto separadamente
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
    const game = new Game('glcanvas1');
    game.init();
});
