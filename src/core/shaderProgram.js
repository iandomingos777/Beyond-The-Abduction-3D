// Classe para encapsular um programa de shader WebGL
// Facilita o gerenciamento de shaders, uniformes e atributos

export class ShaderProgram {
    constructor(gl, vertexSource, fragmentSource) {
        this.gl = gl;
        this.program = null;
        this.attributes = {};
        this.uniforms = {};
        
        this.compile(vertexSource, fragmentSource);
    }

    compile(vertexSource, fragmentSource) {
        const gl = this.gl;
        
        // Criar shaders
        const vertexShader = this.createShader(gl.VERTEX_SHADER, vertexSource);
        const fragmentShader = this.createShader(gl.FRAGMENT_SHADER, fragmentSource);
        
        // Criar programa
        this.program = gl.createProgram();
        gl.attachShader(this.program, vertexShader);
        gl.attachShader(this.program, fragmentShader);
        gl.linkProgram(this.program);
        
        if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
            console.error('Erro ao linkar programa:', gl.getProgramInfoLog(this.program));
            gl.deleteProgram(this.program);
            return;
        }
        
        // Limpar shaders (já estão linkados no programa)
        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);
    }

    createShader(type, source) {
        const gl = this.gl;
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error('Erro ao compilar shader:', gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        
        return shader;
    }

    use() {
        this.gl.useProgram(this.program);
    }

    // Métodos auxiliares para obter localizações (implementar quando necessário)
    getAttribLocation(name) {
        if (!(name in this.attributes)) {
            this.attributes[name] = this.gl.getAttribLocation(this.program, name);
        }
        return this.attributes[name];
    }

    getUniformLocation(name) {
        if (!(name in this.uniforms)) {
            this.uniforms[name] = this.gl.getUniformLocation(this.program, name);
        }
        return this.uniforms[name];
    }
}
