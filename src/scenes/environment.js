/**
 * Definição do cenário (ambiente 3D)
 * Centraliza a geometria tanto para renderização quanto para colisão
 */

const WALL_POS_Y = 9.0; // Centro Y das paredes
const WALL_THICKNESS = 0.5; // Espessura padrão das paredes
const WALL_HEIGHT = 22.0; // Altura padrão das paredes
const FLOOR_POS_Y = -2.0; // Altura do chão
const CEILING_POS_Y = FLOOR_POS_Y + WALL_HEIGHT; // Topo = chão + altura

const WALL_COLOR = [0.7, 0.7, 0.7];
const FLOOR_COLOR = [0.4, 0.4, 0.6];
const CEILING_COLOR = [0.35, 0.35, 0.4];
const ESCAPE_WALL_COLOR = [0.3, 0.5, 0.35];
const ESCAPE_FLOOR_COLOR = [0.25, 0.4, 0.3];
const PLATFORM_COLOR = [0.5, 0.5, 0.55];
const STEP_COLOR = [0.45, 0.45, 0.5];

/**
 * @typedef {Object} SceneElement
 * @property {string} type - 'wall' | 'floor' | 'ceiling' | 'platform' | 'step'
 * @property {Array<number>} position - [x, y, z]
 * @property {Array<number>} size - [width, height, depth]
 * @property {Array<number>} color - [r, g, b]
 * @property {boolean} isCollider
 * @property {Object} [material] - Override de material { ka, kd, ks, shininess }
 */

export const SCENE_GEOMETRY = [
    // --- Sala 1 - Principal ---
    // Piso
    {
        type: 'floor',
        position: [0, FLOOR_POS_Y, 0],
        size: [20.0, 0.1, 20.0],
        color: FLOOR_COLOR,
        isCollider: true,
    },
    // Teto
    {
        type: 'ceiling',
        position: [0, CEILING_POS_Y, 0],
        size: [20.0, 0.1, 20.0],
        color: CEILING_COLOR,
        isCollider: false,
    },
    // Parede Sul (z = -10)
    {
        type: 'wall',
        position: [0, WALL_POS_Y, -10.0],
        size: [20.0, WALL_HEIGHT, WALL_THICKNESS],
        color: WALL_COLOR,
        isCollider: true,
    },
    // Parede Oeste (x = -10)
    {
        type: 'wall',
        position: [-10.0, WALL_POS_Y, 0],
        size: [WALL_THICKNESS, WALL_HEIGHT, 20.0],
        color: WALL_COLOR,
        isCollider: true,
    },
    // Parede Leste (x = +10)
    {
        type: 'wall',
        position: [10.0, WALL_POS_Y, 0],
        size: [WALL_THICKNESS, WALL_HEIGHT, 20.0],
        color: WALL_COLOR,
        isCollider: true,
    },
    // Parede Norte Esquerda (z = +10)
    {
        type: 'wall',
        position: [-7.0, WALL_POS_Y, 10.0],
        size: [6.0, WALL_HEIGHT, WALL_THICKNESS],
        color: WALL_COLOR,
        isCollider: true,
    },
    // Parede Norte Direita (z = +10)
    {
        type: 'wall',
        position: [7.0, WALL_POS_Y, 10.0],
        size: [6.0, WALL_HEIGHT, WALL_THICKNESS],
        color: WALL_COLOR,
        isCollider: true,
    },

    // --- Corredor 1 (Sala 1 -> Sala 2) ---
    {
        type: 'floor',
        position: [0, FLOOR_POS_Y, 20.0],
        size: [8.0, 0.1, 20.0],
        color: FLOOR_COLOR,
        isCollider: true,
    },
    {
        type: 'ceiling',
        position: [0, CEILING_POS_Y, 20.0],
        size: [8.0, 0.1, 20.0],
        color: CEILING_COLOR,
        isCollider: false,
    },
    // Parede Oeste do Corredor (x = -4)
    {
        type: 'wall',
        position: [-4.0, WALL_POS_Y, 20.0],
        size: [WALL_THICKNESS, WALL_HEIGHT, 20.0],
        color: WALL_COLOR,
        isCollider: true,
    },
    // Parede Leste do Corredor (x = +4)
    {
        type: 'wall',
        position: [4.0, WALL_POS_Y, 20.0],
        size: [WALL_THICKNESS, WALL_HEIGHT, 20.0],
        color: WALL_COLOR,
        isCollider: true,
    },

    // --- Sala 2 ---
    {
        type: 'floor',
        position: [0, FLOOR_POS_Y, 60.0],
        size: [60.0, 0.1, 60.0],
        color: FLOOR_COLOR,
        isCollider: true,
    },
    {
        type: 'ceiling',
        position: [0, CEILING_POS_Y, 60.0],
        size: [60.0, 0.1, 60.0],
        color: CEILING_COLOR,
        isCollider: false,
    },
    // Parede Oeste (x = -30)
    {
        type: 'wall',
        position: [-30.0, WALL_POS_Y, 60.0],
        size: [WALL_THICKNESS, WALL_HEIGHT, 60.0],
        color: WALL_COLOR,
        isCollider: true,
    },
    // Parede Leste (x = +30)
    {
        type: 'wall',
        position: [30.0, WALL_POS_Y, 60.0],
        size: [WALL_THICKNESS, WALL_HEIGHT, 60.0],
        color: WALL_COLOR,
        isCollider: true,
    },
    // Parede Sul Direita (z=30)
    {
        type: 'wall',
        position: [17.0, WALL_POS_Y, 30.0],
        size: [26.0, WALL_HEIGHT, WALL_THICKNESS],
        color: WALL_COLOR,
        isCollider: true,
    },
    // Parede Sul Esquerda (z=30)
    {
        type: 'wall',
        position: [-17.0, WALL_POS_Y, 30.0],
        size: [26.0, WALL_HEIGHT, WALL_THICKNESS],
        color: WALL_COLOR,
        isCollider: true,
    },
    // Parede Norte Direita (z=90)
    {
        type: 'wall',
        position: [17.25, WALL_POS_Y, 90.0],
        size: [25.0, WALL_HEIGHT, WALL_THICKNESS],
        color: WALL_COLOR,
        isCollider: true,
    },
    // Parede Norte Esquerda (z=90)
    {
        type: 'wall',
        position: [-17.25, WALL_POS_Y, 90.0],
        size: [25.0, WALL_HEIGHT, WALL_THICKNESS],
        color: WALL_COLOR,
        isCollider: true,
    },

    // --- Corredor 2 (Sala 2 -> Sala 3) ---
    {
        type: 'floor',
        position: [0, FLOOR_POS_Y, 110.0],
        size: [10.0, 0.1, 40.0],
        color: FLOOR_COLOR,
        isCollider: true,
    },
    {
        type: 'ceiling',
        position: [0, CEILING_POS_Y, 110.0],
        size: [10.0, 0.1, 40.0],
        color: CEILING_COLOR,
        isCollider: false,
    },
    // Parede Oeste (x = -5)
    {
        type: 'wall',
        position: [-5.0, WALL_POS_Y, 110.0],
        size: [WALL_THICKNESS, WALL_HEIGHT, 40.0],
        color: WALL_COLOR,
        isCollider: true,
    },
    // Parede Leste (x = +5)
    {
        type: 'wall',
        position: [5.0, WALL_POS_Y, 115.0],
        size: [WALL_THICKNESS, WALL_HEIGHT, 50.0],
        color: WALL_COLOR,
        isCollider: true,
    },
    // Curva L
    {
        type: 'floor',
        position: [-17.5, FLOOR_POS_Y, 135.0],
        size: [45.0, 0.1, 10.0],
        color: FLOOR_COLOR,
        isCollider: true,
    },
    {
        type: 'ceiling',
        position: [-17.5, CEILING_POS_Y, 135.0],
        size: [45.0, 0.1, 10.0],
        color: CEILING_COLOR,
        isCollider: false,
    },
    // Parede Sul (z=130)
    {
        type: 'wall',
        position: [-22.5, WALL_POS_Y, 130.0],
        size: [35.0, WALL_HEIGHT, WALL_THICKNESS],
        color: WALL_COLOR,
        isCollider: true,
    },
    // Parede Norte (z=140)
    {
        type: 'wall',
        position: [-12.5, WALL_POS_Y, 140.0],
        size: [35.0, WALL_HEIGHT, WALL_THICKNESS],
        color: WALL_COLOR,
        isCollider: true,
    },
    // Parede Oeste (x=-40)
    {
        type: 'wall',
        position: [-40.0, WALL_POS_Y, 135.0],
        size: [WALL_THICKNESS, WALL_HEIGHT, 10],
        color: WALL_COLOR,
        isCollider: true,
    },

    // --- Sala 3 ---
    {
        type: 'floor',
        position: [-37.5, FLOOR_POS_Y, 170.0],
        size: [60.0, 0.1, 60.0],
        color: FLOOR_COLOR,
        isCollider: true,
    },
    {
        type: 'ceiling',
        position: [-37.5, CEILING_POS_Y, 170.0],
        size: [60.0, 0.1, 60.0],
        color: CEILING_COLOR,
        isCollider: false,
    },
    // Parede Oeste (x = -67.5)
    {
        type: 'wall',
        position: [-67.5, WALL_POS_Y, 170.0],
        size: [WALL_THICKNESS, WALL_HEIGHT, 60.0],
        color: WALL_COLOR,
        isCollider: true,
    },
    // Parede Leste (x = -7.5)
    {
        type: 'wall',
        position: [-7.5, WALL_POS_Y, 170.0],
        size: [WALL_THICKNESS, WALL_HEIGHT, 60.0],
        color: WALL_COLOR,
        isCollider: true,
    },
    // Parede Sul (z=140)
    {
        type: 'wall',
        position: [-53.75, WALL_POS_Y, 139.75],
        size: [27.0, WALL_HEIGHT, WALL_THICKNESS],
        color: WALL_COLOR,
        isCollider: true,
    },
    // PAREDE NORTE ESQUERDA (z=200) — Lado ESQUERDO da saída para ESCAPE ROOM (gap de x=-50 até x=-25)
    {
        type: 'wall',
        position: [-58.75, WALL_POS_Y, 200.0],
        size: [17.5, WALL_HEIGHT, WALL_THICKNESS],
        color: WALL_COLOR,
        isCollider: true,
    },
    // PAREDE NORTE DIREITA (z=200) — Lado DIREITO da saída para ESCAPE ROOM (gap de x=-50 até x=-25)
    {
        type: 'wall',
        position: [-16.25, WALL_POS_Y, 200.0],
        size: [17.5, WALL_HEIGHT, WALL_THICKNESS],
        color: WALL_COLOR,
        isCollider: true,
    },
    // CORREDOR 3 — Sala 3 → Sala de Fuga (z 200→215)
    {
        type: 'floor',
        position: [-37.5, FLOOR_POS_Y, 207.5],
        size: [25.0, 0.1, 15.0],
        color: ESCAPE_FLOOR_COLOR,
        isCollider: true,
    },
    {
        type: 'ceiling',
        position: [-37.5, CEILING_POS_Y, 207.5],
        size: [25.0, 0.1, 15.0],
        color: CEILING_COLOR,
        isCollider: false,
    },
    // PAREDE OESTE DO CORREDOR 3 (verde, x=-50.0 - alinhado com gap da Sala 3)
    {
        type: 'wall',
        position: [-50.0, WALL_POS_Y, 207.5],
        size: [WALL_THICKNESS, WALL_HEIGHT, 15.0],
        color: ESCAPE_WALL_COLOR,
        isCollider: true,
    },
    // PAREDE LESTE DO CORREDOR 3 (verde, x=-25.0 - alinhado com gap da Sala 3)
    {
        type: 'wall',
        position: [-25.0, WALL_POS_Y, 207.5],
        size: [WALL_THICKNESS, WALL_HEIGHT, 15.0],
        color: ESCAPE_WALL_COLOR,
        isCollider: true,
    },

    // SALA DE FUGA — Room 4 (20×20, centro em -37.5, 225)

    // Piso
    // Piso esquerdo
    {
        type: 'floor',
        position: [-47.0, FLOOR_POS_Y, 225.0],
        size: [6.0, 0.1, 20.0],
        color: ESCAPE_FLOOR_COLOR,
        isCollider: true,
    },
    // Piso direito
    {
        type: 'floor',
        position: [-28.0, FLOOR_POS_Y, 225.0],
        size: [6.0, 0.1, 20.0],
        color: ESCAPE_FLOOR_COLOR,
        isCollider: true,
    },
    // Piso fundo
    {
        type: 'floor',
        position: [-37.5, FLOOR_POS_Y, 231.5],
        size: [13.0, 0.1, 7.0],
        color: ESCAPE_FLOOR_COLOR,
        isCollider: true,
    },
    // Piso frente (entre corredor e buraco)
    {
        type: 'floor',
        position: [-37.5, FLOOR_POS_Y, 218.5],
        size: [13.0, 0.1, 7.0],
        color: ESCAPE_FLOOR_COLOR,
        isCollider: true,
    },
    // Piso entre entrada e plataforma (preenchendo gap)
    {
        type: 'floor',
        position: [-37.5, FLOOR_POS_Y, 225.0],
        size: [13.0, 0.1, 6.0],
        color: ESCAPE_FLOOR_COLOR,
        isCollider: true,
    },
    // O BURACO DE FUGA (sem piso no centro! ~6×6 em -37.5, 225)
    {
        type: 'floor',
        position: [-37.5, FLOOR_POS_Y - 5.0, 225.0],
        size: [13.0, 0.1, 13.0],
        color: [0.05, 0.05, 0.05],
        isCollider: false,
    },
    // TETO DA ESCAPE ROOM
    {
        type: 'ceiling',
        position: [-37.5, CEILING_POS_Y, 225.0],
        size: [25.0, 0.1, 20.0],
        color: CEILING_COLOR,
        isCollider: false,
    },
    // PAREDE OESTE DA ESCAPE ROOM (verde, x=-50.0)
    {
        type: 'wall',
        position: [-50.0, WALL_POS_Y, 225.0],
        size: [WALL_THICKNESS, WALL_HEIGHT, 20.0],
        color: ESCAPE_WALL_COLOR,
        isCollider: true,
    },
    // PAREDE LESTE DA ESCAPE ROOM (verde, x=-25.0)
    {
        type: 'wall',
        position: [-25.0, WALL_POS_Y, 225.0],
        size: [WALL_THICKNESS, WALL_HEIGHT, 20.0],
        color: ESCAPE_WALL_COLOR,
        isCollider: true,
    },
    // PAREDE NORTE DA ESCAPE ROOM (verde, z=235 - fundo)
    {
        type: 'wall',
        position: [-37.5, WALL_POS_Y, 235.0],
        size: [25.0, WALL_HEIGHT, WALL_THICKNESS],
        color: ESCAPE_WALL_COLOR,
        isCollider: true,
    },
    // ENTRADA SUL ABERTA - SEM PAREDES (z=215) para acesso livre do Corredor 3

    // --- Plataforma elevada ---
    {
        type: 'platform',
        position: [-37.5, FLOOR_POS_Y + 1.0, 230.0],
        size: [6.0, 2.0, 4.0],
        color: [0.3, 0.9, 0.4],
        isCollider: true,
        material: { ka: 0.6, kd: 0.8, ks: [0.8, 1.0, 0.8], shininess: 80.0 },
    },

    // --- Sinal de saída na frente da plataforma ---
    {
        type: 'exit',
        position: [-37.5, WALL_POS_Y - 3.0, 235.0 - 0.3],
        size: [12.0, 8.0, 0.05],
        color: [1.0, 1.0, 1.0],
        isCollider: false,
        material: { ka: 0.6, kd: 0.8, ks: [0.5, 0.5, 0.5], shininess: 50.0 },
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
 * @param {CollisionSystem} collisionSystem
 */
export function setupSceneColliders(collisionSystem) {
    const colliders = getColliders();
    colliders.forEach((elem) => {
        collisionSystem.addBox(elem.position, elem.size);
    });
}

/**
 * Centro e raio da sala de fuga (para detecção de zona)
 */
export const ESCAPE_ROOM = {
    center: [-37.5, 0, 225.0],
    minZ: 215.0,
    maxZ: 235.0,
    minX: -50.0,
    maxX: -25.0,
};
