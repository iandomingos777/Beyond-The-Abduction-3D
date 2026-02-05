export class OBJLoader {
    constructor() {
        this.reset();
    }

    reset() {
        this.rawPositions = [];
        this.rawNormals = [];
        this.rawTexCoords = [];

        this.finalVertices = [];
        this.finalNormals = [];
        this.finalTexCoords = [];
        this.finalIndices = [];

        this.cache = {};
        this.nextIndex = 0;
    }

    async load(url) {
        this.reset();
        const response = await fetch(url);
        const text = await response.text();
        return this.parse(text);
    }

    parse(objText) {
        const lines = objText.split('\n');

        for (let line of lines) {
            line = line.trim();
            if (line.startsWith('#') || line === '') continue;

            const parts = line.split(/\s+/);
            const type = parts[0];

            if (type === 'v') {
                this.rawPositions.push([
                    parseFloat(parts[1]),
                    parseFloat(parts[2]),
                    parseFloat(parts[3]),
                ]);
            } else if (type === 'vn') {
                this.rawNormals.push([
                    parseFloat(parts[1]),
                    parseFloat(parts[2]),
                    parseFloat(parts[3]),
                ]);
            } else if (type === 'vt') {
                this.rawTexCoords.push([parseFloat(parts[1]), parseFloat(parts[2])]);
            } else if (type === 'f') {
                // TRIANGULAÇÃO DE FACES
                // Transforma faces de N vértices em triângulos (Fan Triangulation)
                const faceVerts = [];
                for (let i = 1; i < parts.length; i++) {
                    faceVerts.push(this.processVertex(parts[i]));
                }

                // Se for um triângulo (3 vértices), empurra 0, 1, 2
                // Se for um quadrado (4 vértices), empurra 0,1,2 e 0,2,3
                const v0 = faceVerts[0];
                for (let i = 1; i < faceVerts.length - 1; i++) {
                    this.finalIndices.push(v0);
                    this.finalIndices.push(faceVerts[i]);
                    this.finalIndices.push(faceVerts[i + 1]);
                }
            }
        }

        return {
            vertices: new Float32Array(this.finalVertices),
            normals: new Float32Array(this.finalNormals),
            texCoords: new Float32Array(this.finalTexCoords),
            indices: new Uint16Array(this.finalIndices),
        };
    }

    processVertex(vertexData) {
        if (this.cache[vertexData] !== undefined) {
            return this.cache[vertexData];
        }

        const indices = vertexData.split('/');

        // Posição
        const vIdx = parseInt(indices[0]) - 1;
        const pos = this.rawPositions[vIdx];
        this.finalVertices.push(...pos);

        // Textura
        if (indices[1] && indices[1] !== '') {
            const tIdx = parseInt(indices[1]) - 1;
            const tex = this.rawTexCoords[tIdx];
            this.finalTexCoords.push(...tex);
        } else {
            this.finalTexCoords.push(0, 0);
        }

        // Normal
        if (indices[2] && indices[2] !== '') {
            const nIdx = parseInt(indices[2]) - 1;
            const norm = this.rawNormals[nIdx];
            this.finalNormals.push(...norm);
        } else {
            this.finalNormals.push(0, 1, 0);
        }

        const index = this.nextIndex++;
        this.cache[vertexData] = index;
        return index;
    }
}

export async function loadOBJModel(game, path) {
    const loader = new OBJLoader();
    const modelData = await loader.load(path);

    const gl = game.gl;
    // Objeto que conterá todos os buffers desta malha 3D
    const mesh = {
        positionBuffer: null,
        normalBuffer: null, // Adicionado para Iluminação (Phong)
        texCoordBuffer: null, // Adicionado para Texturas
        indexBuffer: null,
        count: 0,
    };

    // Buffer de Posições (Vértices)
    mesh.positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, mesh.positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, modelData.vertices, gl.STATIC_DRAW);

    // Enviar as normais para a GPU
    if (modelData.normals && modelData.normals.length > 0) {
        mesh.normalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, mesh.normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, modelData.normals, gl.STATIC_DRAW);
    }

    // Buffer de Textura (UVs)
    if (modelData.texCoords && modelData.texCoords.length > 0) {
        mesh.texCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, mesh.texCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, modelData.texCoords, gl.STATIC_DRAW);
    }

    // Buffer de Índices
    mesh.indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, modelData.indices, gl.STATIC_DRAW);

    mesh.count = modelData.indices.length;

    return mesh; // Retorna o objeto pronto para uso
}
