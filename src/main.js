import { getGL } from './core/glContext.js';
import { createShader, createProgram } from './core/shaderUtils.js';
import { createCubeMesh } from './geometries/Cube.js';
import { loadOBJModel } from './core/objLoader.js';
import { drawCrushedCan, drawCube, drawUFO } from './core/draw.js';

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

        // Matrizes
        this.modelMatrix = mat4.create();
        this.viewMatrix = mat4.create();
        this.projectionMatrix = mat4.create();
    }

    // ... (Mantenha initGL e loadShader iguais) ...
    initGL() {
        this.gl = getGL(this.canvas);
        if (!this.gl) return false;
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        this.gl.clearColor(0.1, 0.1, 0.15, 1.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        return true;
    }

    async loadShader(url) {
        const response = await fetch(url);
        return await response.text();
    }

    async init() {
        if (!this.initGL()) return;

        // 1. Shaders
        const vShaderSrc = await this.loadShader('./assets/shaders/vertex.glsl');
        const fShaderSrc = await this.loadShader('./assets/shaders/fragment.glsl');
        this.program = createProgram(
            this.gl,
            createShader(this.gl, this.gl.VERTEX_SHADER, vShaderSrc),
            createShader(this.gl, this.gl.FRAGMENT_SHADER, fShaderSrc),
        );
        this.gl.useProgram(this.program);

        // 2. Criar Geometrias
        // Agora o Cubo é criado igual aos outros: gerando dados
        this.cubeMesh = createCubeMesh(this.gl);

        // Carregar OBJs
        this.ufoMesh = await loadOBJModel(this, '../assets/models/Low_poly_UFO.obj');
        this.canMesh = await loadOBJModel(this, '../assets/models/can_crushed_lowpoly.obj');

        this.setupMatrices();
        requestAnimationFrame((t) => this.loop(t));
    }

    setupMatrices() {
        const fov = (45 * Math.PI) / 180;
        const aspect = this.canvas.width / this.canvas.height;
        mat4.perspective(this.projectionMatrix, fov, aspect, 0.1, 100.0);

        // Câmera
        mat4.lookAt(this.viewMatrix, [0, 0, 8], [0, 0, 0], [0, 1, 0]);
    }

    update(dt) {
        this.cubeRotation += dt * 1.5;
        this.ufoRotation += dt * 0.5;
        this.canRotation += dt * 0.8;
    }

    draw() {
        const gl = this.gl;
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        const uView = gl.getUniformLocation(this.program, 'uViewMatrix');
        const uProj = gl.getUniformLocation(this.program, 'uProjectionMatrix');

        gl.uniformMatrix4fv(uView, false, this.viewMatrix);
        gl.uniformMatrix4fv(uProj, false, this.projectionMatrix);

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
