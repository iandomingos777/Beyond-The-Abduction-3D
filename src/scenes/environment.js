/**
 * Definição do cenário (ambiente 3D)
 * Centraliza a geometria tanto para renderização quanto para colisão
 */

const BUILDING_MODE = true;

const WALL_POS_Y = 6.0; // Altura padrão das paredes
const WALL_THICKNESS = 0.5; // Espessura padrão das paredes
const WALL_HEIGHT = 16.0; // Altura padrão das paredes
const FLOOR_POS_Y = -2.0; // Altura do chão

const WALL_COLOR = [0.7, 0.7, 0.7]; // Cinza
const FLOOR_COLOR = [0.4, 0.4, 0.9]; // Azul

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
        position: [0, FLOOR_POS_Y, 0],
        size: [20.0, 0.1, 20.0],
        color: FLOOR_COLOR, // Azul
        isCollider: true, // Jogador anda sobre o chão
    },
    {
        type: 'wall', // PAREDES DE FUNDO
        position: [0, WALL_POS_Y, -10.0],
        size: [20.0, WALL_HEIGHT, WALL_THICKNESS],
        color: WALL_COLOR, // Cinza
        isCollider: true,
    },
    {
        type: 'wall', // PAREDES PRINCIPAIS
        position: [-10.0, WALL_POS_Y, 0],
        size: [WALL_THICKNESS, WALL_HEIGHT, 20.0],
        color: WALL_COLOR,
        isCollider: true,
    },
    {
        type: 'wall', // PAREDES PRINCIPAIS
        position: [10.0, WALL_POS_Y, 0],
        size: [WALL_THICKNESS, WALL_HEIGHT, 20.0],
        color: WALL_COLOR,
        isCollider: true,
    },

    // --- CORREDOR ---
    {
        type: 'floor',
        position: [0, FLOOR_POS_Y, 20.0],
        size: [8.0, 0.1, 20.0],
        color: FLOOR_COLOR,
        isCollider: true,
    },
    {
        type: 'wall', // PAREDES AO LADO DO CORREDOR
        position: [-4.0, WALL_POS_Y, 20.0],
        size: [WALL_THICKNESS, WALL_HEIGHT, 20.0],
        color: WALL_COLOR,
        isCollider: true,
    },
    {
        type: 'wall', // PAREDES AO LADO DO CORREDOR
        position: [4.0, WALL_POS_Y, 20.0],
        size: [WALL_THICKNESS, WALL_HEIGHT, 20.0],
        color: WALL_COLOR,
        isCollider: true,
    },
    // --- SALA 2 ---
    {
        type: 'floor',
        position: [0, FLOOR_POS_Y, 60.0],
        size: [60.0, 0.1, 60.0],
        color: FLOOR_COLOR,
        isCollider: true,
    },
    {
        type: 'wall', // PAREDES PRINCIPAIS
        position: [-30.0, WALL_POS_Y, 60.0],
        size: [WALL_THICKNESS, WALL_HEIGHT, 60.0],
        color: WALL_COLOR,
        isCollider: true,
    },
    {
        type: 'wall', // PAREDES PRINCIPAIS
        position: [30.0, WALL_POS_Y, 60.0],
        size: [WALL_THICKNESS, WALL_HEIGHT, 60.0],
        color: WALL_COLOR,
        isCollider: true,
    },
    {
        // PAREDES AO LADO DO CORREDOR
        type: 'wall',
        position: [17.0, WALL_POS_Y, 30.0],
        size: [26.0, WALL_HEIGHT, WALL_THICKNESS],
        color: WALL_COLOR,
        isCollider: true,
    },
    {
        // PAREDES AO LADO DO CORREDOR
        type: 'wall',
        position: [-17.0, WALL_POS_Y, 30.0],
        size: [26.0, WALL_HEIGHT, WALL_THICKNESS],
        color: WALL_COLOR,
        isCollider: true,
    },
    {
        // PAREDES AO LADO DO CORREDOR
        type: 'wall',
        position: [17.25, WALL_POS_Y, 90.0],
        size: [25.0, WALL_HEIGHT, WALL_THICKNESS],
        color: WALL_COLOR,
        isCollider: true,
    },
    {
        // PAREDES AO LADO DO CORREDOR
        type: 'wall',
        position: [-17.25, WALL_POS_Y, 90.0],
        size: [25.0, WALL_HEIGHT, WALL_THICKNESS],
        color: WALL_COLOR,
        isCollider: true,
    },
    // Corredor Sala 2 -> Sala 3 (Em L)
    {
        type: 'floor',
        position: [0, FLOOR_POS_Y, 110.0],
        size: [10.0, 0.1, 40.0],
        color: FLOOR_COLOR,
        isCollider: true,
    },
    {
        type: 'wall', // PAREDES AO LADO DO CORREDOR
        position: [-5.0, WALL_POS_Y, 110.0],
        size: [WALL_THICKNESS, WALL_HEIGHT, 40.0],
        color: WALL_COLOR,
        isCollider: true,
    },
    {
        type: 'wall', // PAREDES AO LADO DO CORREDOR
        position: [5.0, WALL_POS_Y, 115.0],
        size: [WALL_THICKNESS, WALL_HEIGHT, 50.0],
        color: WALL_COLOR,
        isCollider: true,
    },
    {
        // Corredor curva
        type: 'floor',
        position: [-17.5, FLOOR_POS_Y, 135.0],
        size: [45.0, 0.1, 10.0],
        color: FLOOR_COLOR,
        isCollider: true,
    },
    {
        type: 'wall', // PAREDES AO LADO DO CORREDOR
        position: [-22.5, WALL_POS_Y, 130.0],
        size: [35.0, WALL_HEIGHT, WALL_THICKNESS],
        color: WALL_COLOR,
        isCollider: true,
    },
    {
        type: 'wall', // PAREDES AO LADO DO CORREDOR
        position: [-12.5, WALL_POS_Y, 140.0],
        size: [35.0, WALL_HEIGHT, WALL_THICKNESS],
        color: WALL_COLOR,
        isCollider: true,
    },
    {
        type: 'wall', // PAREDES AO FIM DO CORREDOR
        position: [-40.0, WALL_POS_Y, 135.0],
        size: [WALL_THICKNESS, WALL_HEIGHT, 10],
        color: WALL_COLOR,
        isCollider: true,
    },
    // --- SALA 3 ---
    {
        type: 'floor',
        position: [-37.5, FLOOR_POS_Y, 170.0],
        size: [60.0, 0.1, 60.0],
        color: FLOOR_COLOR,
        isCollider: true,
    },
    {
        type: 'wall', // PAREDES PRINCIPAIS
        position: [-67.5, WALL_POS_Y, 170.0],
        size: [WALL_THICKNESS, WALL_HEIGHT, 60.0],
        color: WALL_COLOR,
        isCollider: true,
    },
    {
        type: 'wall', // PAREDES PRINCIPAIS
        position: [-7.5, WALL_POS_Y, 170.0],
        size: [WALL_THICKNESS, WALL_HEIGHT, 60.0],
        color: WALL_COLOR,
        isCollider: true,
    },
    {
        // PAREDES AO LADO DO CORREDOR
        type: 'wall',
        position: [-53.75, WALL_POS_Y, 139.75],
        size: [27.0, WALL_HEIGHT, WALL_THICKNESS],
        color: WALL_COLOR,
        isCollider: true,
    },
];

if (BUILDING_MODE) {
    for (let i = 0; i < SCENE_GEOMETRY.length; i++) {
        SCENE_GEOMETRY[i].isCollider = false;
    }
}

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
