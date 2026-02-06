/**
 * Sistema de Colisão 3D usando AABB (Axis-Aligned Bounding Boxes)
 * 
 * Permite registrar colisores estáticos (paredes, obstáculos) e testar
 * colisões com o jogador, retornando posições corrigidas.
 */

export class CollisionSystem {
    constructor() {
        // Array de colisores estáticos no mundo
        // Cada colisor: { position: [x,y,z], size: [sx,sy,sz] }
        this.colliders = [];
    }

    /**
     * Adiciona um colisor AABB ao sistema
     * @param {Array} position - Centro do colisor [x, y, z]
     * @param {Array} size - Dimensões totais [width, height, depth]
     */
    addBox(position, size) {
        this.colliders.push({
            position: [...position],
            size: [...size],
        });
    }

    /**
     * Limpa todos os colisores registrados
     */
    clear() {
        this.colliders = [];
    }

    /**
     * Testa se dois AABBs estão colidindo
     * @param {Array} posA - Centro do AABB A [x, y, z]
     * @param {Array} sizeA - Tamanho do AABB A [w, h, d]
     * @param {Array} posB - Centro do AABB B [x, y, z]
     * @param {Array} sizeB - Tamanho do AABB B [w, h, d]
     * @returns {boolean} - true se há colisão
     */
    checkAABB(posA, sizeA, posB, sizeB) {
        // Calcula os limites (min/max) de cada AABB
        const aMin = [
            posA[0] - sizeA[0] / 2,
            posA[1] - sizeA[1] / 2,
            posA[2] - sizeA[2] / 2,
        ];
        const aMax = [
            posA[0] + sizeA[0] / 2,
            posA[1] + sizeA[1] / 2,
            posA[2] + sizeA[2] / 2,
        ];

        const bMin = [
            posB[0] - sizeB[0] / 2,
            posB[1] - sizeB[1] / 2,
            posB[2] - sizeB[2] / 2,
        ];
        const bMax = [
            posB[0] + sizeB[0] / 2,
            posB[1] + sizeB[1] / 2,
            posB[2] + sizeB[2] / 2,
        ];

        // Teste de separação nos 3 eixos
        return (
            aMin[0] <= bMax[0] && aMax[0] >= bMin[0] &&
            aMin[1] <= bMax[1] && aMax[1] >= bMin[1] &&
            aMin[2] <= bMax[2] && aMax[2] >= bMin[2]
        );
    }

    /**
     * Resolve colisão com sliding
     * Testa movimento por eixo individual, permitindo deslizar ao longo das paredes
     * 
     * @param {Array} oldPos - Posição anterior [x, y, z]
     * @param {Array} newPos - Posição desejada [x, y, z]
     * @param {Array} playerSize - Tamanho do jogador [w, h, d]
     * @returns {Array} - Posição corrigida após resolver colisões
     */
    resolveCollision(oldPos, newPos, playerSize = [0.5, 1.8, 0.5]) {
        // Se não se moveu, retorna a posição antiga
        if (this._vecEqual(oldPos, newPos)) {
            return [...oldPos];
        }

        // Testa a nova posição completa
        if (!this._hasCollision(newPos, playerSize)) {
            return [...newPos]; // Sem colisão, movimento livre
        }

        // Há colisão - tenta movimento por eixo (sliding)
        const result = [...oldPos];

        // Tenta mover apenas em X
        const testX = [newPos[0], oldPos[1], oldPos[2]];
        if (!this._hasCollision(testX, playerSize)) {
            result[0] = newPos[0];
        }

        // Tenta mover apenas em Y
        const testY = [result[0], newPos[1], oldPos[2]];
        if (!this._hasCollision(testY, playerSize)) {
            result[1] = newPos[1];
        }

        // Tenta mover apenas em Z
        const testZ = [result[0], result[1], newPos[2]];
        if (!this._hasCollision(testZ, playerSize)) {
            result[2] = newPos[2];
        }

        return result;
    }

    /**
     * Verifica se uma posição colide com algum colisor registrado
     * @param {Array} position - Posição a testar [x, y, z]
     * @param {Array} size - Tamanho do objeto [w, h, d]
     * @returns {boolean} - true se há colisão
     * @private
     */
    _hasCollision(position, size) {
        for (const collider of this.colliders) {
            if (this.checkAABB(position, size, collider.position, collider.size)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Compara dois vetores (tolerância pequena para erros de ponto flutuante)
     * @private
     */
    _vecEqual(a, b, epsilon = 0.0001) {
        return (
            Math.abs(a[0] - b[0]) < epsilon &&
            Math.abs(a[1] - b[1]) < epsilon &&
            Math.abs(a[2] - b[2]) < epsilon
        );
    }

    /**
     * Retorna quantidade de colisores registrados (útil para debug)
     */
    getColliderCount() {
        return this.colliders.length;
    }
}
