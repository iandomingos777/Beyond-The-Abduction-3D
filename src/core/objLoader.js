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

    async load(url, normalize = false) {
        this.reset();
        const response = await fetch(url);
        const text = await response.text();
        const data = this.parse(text);

        // Aplica a normalização apenas se solicitado (para o sofá)
        if (normalize) {
            this.normalizeMesh(data);
        }

        return data;
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
                const faceVerts = [];
                for (let i = 1; i < parts.length; i++) {
                    faceVerts.push(this.processVertex(parts[i]));
                }

                // Triangulação Fan (padrão do seu código original)
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

        // Posição: Volta para a lógica simples (Base-1 para Base-0)
        const vIdx = parseInt(indices[0]) - 1;
        // Proteção contra índice inválido (evita crash "partial render")
        const pos = this.rawPositions[vIdx] || [0, 0, 0];
        this.finalVertices.push(...pos);

        // Textura: Volta para a lógica original (sem inverter Y)
        if (indices[1] && indices[1] !== '') {
            const tIdx = parseInt(indices[1]) - 1;
            const tex = this.rawTexCoords[tIdx] || [0, 0];
            this.finalTexCoords.push(...tex);
        } else {
            this.finalTexCoords.push(0, 0);
        }

        // Normal
        if (indices[2] && indices[2] !== '') {
            const nIdx = parseInt(indices[2]) - 1;
            const norm = this.rawNormals[nIdx] || [0, 1, 0];
            this.finalNormals.push(...norm);
        } else {
            this.finalNormals.push(0, 1, 0);
        }

        const index = this.nextIndex++;
        this.cache[vertexData] = index;
        return index;
    }

    normalizeMesh(meshData) {
        let minX = Infinity,
            minY = Infinity,
            minZ = Infinity;
        let maxX = -Infinity,
            maxY = -Infinity,
            maxZ = -Infinity;
        const verts = meshData.vertices;

        // 1. Encontra limites
        for (let i = 0; i < verts.length; i += 3) {
            const x = verts[i],
                y = verts[i + 1],
                z = verts[i + 2];
            if (x < minX) minX = x;
            if (y < minY) minY = y;
            if (z < minZ) minZ = z;
            if (x > maxX) maxX = x;
            if (y > maxY) maxY = y;
            if (z > maxZ) maxZ = z;
        }

        // 2. Calcula escala e centro
        const centerX = (minX + maxX) / 2;
        const centerY = (minY + maxY) / 2;
        const centerZ = (minZ + maxZ) / 2;
        const maxDim = Math.max(maxX - minX, maxY - minY, maxZ - minZ);
        // Evita divisão por zero
        const scale = maxDim > 0 ? 1.0 / maxDim : 1.0;

        // 3. Aplica
        for (let i = 0; i < verts.length; i += 3) {
            verts[i] = (verts[i] - centerX) * scale;
            verts[i + 1] = (verts[i + 1] - centerY) * scale;
            verts[i + 2] = (verts[i + 2] - centerZ) * scale;
        }
    }
}

// Wrapper mantido igual, mas usando o parâmetro normalize
export async function loadOBJModel(game, path, normalize = true) {
    const loader = new OBJLoader();
    const modelData = await loader.load(path, normalize);

    const gl = game.gl;
    const mesh = {
        positionBuffer: gl.createBuffer(),
        normalBuffer: modelData.normals.length > 0 ? gl.createBuffer() : null,
        texCoordBuffer: modelData.texCoords.length > 0 ? gl.createBuffer() : null,
        indexBuffer: gl.createBuffer(),
        count: modelData.indices.length,
    };

    gl.bindBuffer(gl.ARRAY_BUFFER, mesh.positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, modelData.vertices, gl.STATIC_DRAW);

    if (mesh.normalBuffer) {
        gl.bindBuffer(gl.ARRAY_BUFFER, mesh.normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, modelData.normals, gl.STATIC_DRAW);
    }

    if (mesh.texCoordBuffer) {
        gl.bindBuffer(gl.ARRAY_BUFFER, mesh.texCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, modelData.texCoords, gl.STATIC_DRAW);
    }

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, modelData.indices, gl.STATIC_DRAW);

    return mesh;
}
