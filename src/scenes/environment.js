/**
 * Definição do cenário (ambiente 3D)
 * Centraliza a geometria tanto para renderização quanto para colisão
 */

/**
 * Estrutura que define cada elemento do cenário
 * @typedef {Object} SceneElement
 * @property {string} type - Tipo do elemento ('wall', 'floor', 'ceiling')
 * @property {Array<number>} position - Posição [x, y, z]
 * @property {Array<number>} size - Dimensões [width, height, depth]
 * @property {Array<number>} color - Cor RGB [r, g, b]
 * @property {boolean} isCollider - Se deve ser usado como colisor
 */

/**
 * Define todos os elementos do cenário
 * Esta estrutura única serve tanto para desenho quanto para colisão
 */
export const SCENE_GEOMETRY = [
    // --- SALA PRINCIPAL ---
    {
        type: 'floor',
        position: [0, -2.0, 0],
        size: [20.0, 0.1, 20.0],
        color: [0.4, 0.4, 0.9], // Azul
        isCollider: false, // Jogador anda sobre o chão
    },
    {
        type: 'wall',
        position: [0, 2, -10.0],
        size: [20.0, 12.0, 0.5],
        color: [0.7, 0.7, 0.7], // Cinza
        isCollider: true,
    },
    {
        type: 'wall',
        position: [-10.0, 2, 0],
        size: [0.5, 12.0, 20.0],
        color: [0.7, 0.7, 0.7],
        isCollider: true,
    },
    {
        type: 'wall',
        position: [10.0, 2, 0],
        size: [0.5, 12.0, 20.0],
        color: [0.7, 0.7, 0.7],
        isCollider: true,
    },

    // --- CORREDOR ---
    {
        type: 'floor',
        position: [0, -2.0, 20.0],
        size: [8.0, 0.1, 20.0],
        color: [0.4, 0.4, 0.9],
        isCollider: false,
    },
    {
        type: 'wall',
        position: [-4.0, 0, 20.0],
        size: [0.5, 2.0, 20.0],
        color: [0.7, 0.7, 0.7],
        isCollider: true,
    },
    {
        type: 'wall',
        position: [4.0, 0, 20.0],
        size: [0.5, 2.0, 20.0],
        color: [0.7, 0.7, 0.7],
        isCollider: true,
    },
];

/**
 * Retorna apenas os elementos que devem ser colisores
 */
export function getColliders() {
    return SCENE_GEOMETRY.filter((elem) => elem.isCollider);
}

/**
 * Registra todos os colisores do cenário no sistema de colisão
 * @param {CollisionSystem} collisionSystem - Sistema de colisão
 */
export function setupSceneColliders(collisionSystem) {
    const colliders = getColliders();
    colliders.forEach((elem) => {
        collisionSystem.addBox(elem.position, elem.size);
    });
}
