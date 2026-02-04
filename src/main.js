import { getGL } from './core/glContext.js';
import { createShader, createProgram } from './core/shaderUtils.js';
import { createCubeMesh } from './geometries/cube.js';
import { loadOBJModel } from './core/objLoader.js';
import { drawCrushedCan, drawCube, drawUFO } from './core/draw.js';
import { loadTexture } from './core/textureLoader.js';
import { Camera } from './systems/camera.js';
import * as mat4 from './math/mat4.js';
import { InputManager } from './systems/input.js';

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

        // Matrizes
        this.modelMatrix = mat4.identityMatrix();
        this.viewMatrix = mat4.identityMatrix();
        
        this.Camera = new Camera();
        
        this.InputManager = new InputManager(this.canvas);
    }

    // ... (Mantenha initGL e loadShader iguais) ...
    initGL() {
        this.gl = getGL(this.canvas);
        if (!this.gl) return false;
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        this.gl.clearColor(0.1, 0.1, 0.15, 1.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.BLEND);
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

        // Carregar assets

        // Carrega a textura em paralelo com os modelos
        this.crushedCanTexture = await loadTexture(
            this.gl,
            '../assets/textures/can_crushed_lowpoly_BaseColor_Opacity_2k.png',
        );

        this.cubeMesh = createCubeMesh(this.gl);

        // Carregar OBJs
        this.ufoMesh = await loadOBJModel(this, '../assets/models/Low_poly_UFO.obj');
        this.canMesh = await loadOBJModel(this, '../assets/models/can_crushed_lowpoly.obj');

        this.setupProjection();
        this.setupMatrices();

        requestAnimationFrame((t) => this.loop(t));
        }

    setupProjection() {
        const fov = 45; // em graus
        const aspect = this.canvas.width / this.canvas.height;
        this.projectionMatrix = mat4.createPerspective(fov, aspect, 0.1, 100.0);
    }

    setupMatrices() {
    this.viewMatrix = this.Camera.getViewMatrix();
}

    update(dt) {
        this.cubeRotation += dt * 1.5;
        this.ufoRotation += dt * 0.5;
        this.canRotation += dt * 0.8;
        
        const { forward, right } = this.InputManager.getAxis();
        this.Camera.move(forward, right, dt);

        const mouse = this.InputManager.getMouseDelta();
        this.Camera.look(mouse.x, -mouse.y);

         this.viewMatrix = this.Camera.getViewMatrix();
    }

    draw() {
        const gl = this.gl;
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        const uView = gl.getUniformLocation(this.program, 'uViewMatrix');
        const uProj = gl.getUniformLocation(this.program, 'uProjectionMatrix');

        const view = this.Camera.getViewMatrix();
        gl.uniformMatrix4fv(uView, false, view);
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
