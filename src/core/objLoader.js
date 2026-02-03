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
