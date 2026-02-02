import { getGL } from './core/glContext.js';
import { createShader, createProgram } from './core/shaderUtils.js';
import { Cube } from './geometries/Cube.js';

class Game {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.gl = null;

        // Estado do jogo
        this.lastTime = 0;
        this.rotation = 0; // Rotação do cubo para animação

        // Shader Program
        this.program = null;

        // Geometria
        this.cube = null;

        // Matrizes
        this.modelMatrix = mat4.create();
        this.viewMatrix = mat4.create();
        this.projectionMatrix = mat4.create();
    }

    initGL() {
        this.gl = getGL(this.canvas);
        if (!this.gl) {
            return false;
        }
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        this.gl.clearColor(0.1, 0.1, 0.15, 1.0);
        this.gl.enable(this.gl.DEPTH_TEST); // Importante para 3D!
        return true;
    }

    async loadShader(url) {
        const response = await fetch(url);
        return await response.text();
    }

    async init() {
        // 1. Inicializar WebGL
        if (!this.initGL()) {
            console.error('Falha ao inicializar WebGL');
            return;
        }

        // 2. Carregar e Compilar Shaders
        const vShaderSrc = await this.loadShader('./assets/shaders/vertex.glsl');
        const fShaderSrc = await this.loadShader('./assets/shaders/fragment.glsl');
        
        const vertexShader = createShader(this.gl, this.gl.VERTEX_SHADER, vShaderSrc);
        const fragmentShader = createShader(this.gl, this.gl.FRAGMENT_SHADER, fShaderSrc);
        
        this.program = createProgram(this.gl, vertexShader, fragmentShader);
        this.gl.useProgram(this.program);

        // 3. Criar Geometria
        this.cube = new Cube(this.gl);

        // 4. Configurar matrizes
        this.setupMatrices();

        // 5. Iniciar Loop
        requestAnimationFrame((t) => this.loop(t));
    }

    setupMatrices() {
        // Matriz de Projeção (Perspectiva)
        const fov = 45 * Math.PI / 180; // 45 graus em radianos
        const aspect = this.canvas.width / this.canvas.height;
        const near = 0.1;
        const far = 100.0;
        mat4.perspective(this.projectionMatrix, fov, aspect, near, far);

        // Matriz de View (Câmera)
        const eye = [0, 0, 5];    // Posição da câmera
        const center = [0, 0, 0]; // Para onde olha
        const up = [0, 1, 0];     // Vetor "para cima"
        mat4.lookAt(this.viewMatrix, eye, center, up);
    }

    createBuffers() {
        // Não precisa mais - o Cube gerencia seus próprios buffers
    }

    update(dt) {
        // Animação: Rotacionar o cubo
        this.rotation += dt * 1.0; // 1 radiano por segundo
    }

    draw() {
        const gl = this.gl;
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // Atualizar matriz do modelo (transformações do objeto)
        mat4.identity(this.modelMatrix);
        mat4.rotateY(this.modelMatrix, this.modelMatrix, this.rotation);
        mat4.rotateX(this.modelMatrix, this.modelMatrix, this.rotation * 0.5);

        // Enviar matrizes para o shader
        const uModelMatrix = gl.getUniformLocation(this.program, 'uModelMatrix');
        const uViewMatrix = gl.getUniformLocation(this.program, 'uViewMatrix');
        const uProjectionMatrix = gl.getUniformLocation(this.program, 'uProjectionMatrix');

        gl.uniformMatrix4fv(uModelMatrix, false, this.modelMatrix);
        gl.uniformMatrix4fv(uViewMatrix, false, this.viewMatrix);
        gl.uniformMatrix4fv(uProjectionMatrix, false, this.projectionMatrix);

        // Desenhar cubo
        this.cube.bind(this.program);
        this.cube.draw();
    }

    loop(timestamp) {
        const dt = (timestamp - this.lastTime) / 1000;
        this.lastTime = timestamp;

        this.update(dt);
        this.draw();

        requestAnimationFrame((t) => this.loop(t));
    }
}

// Inicialização
window.addEventListener('DOMContentLoaded', () => {
    const game = new Game('glcanvas1');
    game.init();
});
