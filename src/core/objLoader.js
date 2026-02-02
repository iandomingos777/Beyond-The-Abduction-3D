// Leitor próprio de arquivos OBJ (Requisito obrigatório para Jogo 3D)
// Deve carregar vértices, normais, coordenadas de textura e faces

export class OBJLoader {
    constructor() {
        this.vertices = [];
        this.normals = [];
        this.texCoords = [];
        this.indices = [];
    }

    async load(url) {
        const response = await fetch(url);
        const text = await response.text();
        return this.parse(text);
    }

    parse(objText) {
        // TODO: Implementar parser de OBJ
        // Formato OBJ:
        // v x y z          - vértice
        // vn x y z         - normal
        // vt u v           - coordenada de textura
        // f v1/vt1/vn1 ... - face
        
        const lines = objText.split('\n');
        
        const positions = [];
        const normals = [];
        const texCoords = [];
        const finalVertices = [];
        const finalNormals = [];
        const finalTexCoords = [];
        
        for (let line of lines) {
            line = line.trim();
            if (line.startsWith('#') || line === '') continue;
            
            const parts = line.split(/\s+/);
            const type = parts[0];
            
            // TODO: Implementar parsing completo
            // Por enquanto estrutura básica
        }
        
        return {
            vertices: finalVertices,
            normals: finalNormals,
            texCoords: finalTexCoords,
            indices: this.indices
        };
    }
}
