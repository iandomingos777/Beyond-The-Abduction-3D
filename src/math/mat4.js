export function createPerspective(fovy, aspect, near, far) {
    const f = 1.0 / Math.tan((fovy * Math.PI / 180) / 2);
    const nf = 1 / (near - far);

    return new Float32Array([
        f / aspect, 0, 0, 0,
        0, f, 0, 0,
        0, 0, (far + near) * nf, -1,
        0, 0, (2 * far * near) * nf, 0
    ]);
}


export function createCamera(pos, target, up)
{  
  var zc = math.subtract(pos, target);
  zc = math.divide(zc, math.norm(zc));
  
  var yt = math.subtract(up, pos);
  yt = math.divide(yt, math.norm(yt));
  
  var xc = math.cross(yt, zc);
  xc = math.divide(xc, math.norm(xc));
  
  var yc = math.cross(zc, xc);
  yc = math.divide(yc,math.norm(yc));
  
  var mt = math.inv(math.transpose(new Float32Array([xc,yc,zc])));
  
  mt = math.resize(mt, [4,4], 0);
  mt._data[3][3] = 1;
  
  var mov = new Float32Array([[1, 0, 0, -pos[0]], 
                         [0, 1, 0, -pos[1]],
                         [0, 0, 1, -pos[2]],
                         [0, 0, 0, 1]]);
  
  var cam = math.multiply(mt, mov);
  
  return cam;
}     

export function identityMatrix() {
    return new Float32Array([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ]);
}

/**
 * Multiplica duas matrizes
 */
export function multiplyMatrices(a, b) {
    const out = new Float32Array(16);

    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            out[j * 4 + i] =
                a[i]      * b[j * 4] +
                a[i + 4]  * b[j * 4 + 1] +
                a[i + 8]  * b[j * 4 + 2] +
                a[i + 12] * b[j * 4 + 3];
        }
    }
    return out;
}

export function identity(mat) {
    return multiplyMatrices(mat, identityMatrix());
}

/**
 * Retorna matriz de translação
 */
export function translateMatrix(tx, ty, tz) {
    return new Float32Array([
        [1,0,0,tx],
        [0,1,0,ty],
        [0,0,1,tz],
        [0,0,0,1]
    ]);
}

/**
 * Multiplica matriz atual por translação
 */
export function translate(mat, tx, ty, tz) {
    return multiplyMatrices(mat, translateMatrix(tx, ty, tz));
}

/**
 * Multiplica matriz atual por escala
 */
export function scaleMatrix(sx, sy, sz) {
    return new Float32Array([
        sx, 0,  0,  0,
        0,  sy, 0,  0,
        0,  0,  sz, 0,
        0,  0,  0,  1
    ]);
}

export function scale(mat, sx, sy, sz) {
    return multiplyMatrices(mat, scaleMatrix(sx, sy, sz));
}

export function rotateXMatrix(angle) {
    const c = Math.cos(angle);
    const s = Math.sin(angle);

    return new Float32Array([
        1, 0, 0, 0,
        0, c, s, 0,
        0, -s, c, 0,
        0, 0, 0, 1
    ]);
}

export function rotateYMatrix(angle) {
    const c = Math.cos(angle);
    const s = Math.sin(angle);

    return new Float32Array([
        c, 0, -s, 0,
        0, 1,  0, 0,
        s, 0,  c, 0,
        0, 0,  0, 1
    ]);
}

export function rotateZMatrix(angle) {
    const c = Math.cos(angle);
    const s = Math.sin(angle);

    return new Float32Array([
        c, s, 0, 0,
       -s, c, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ]);
}

// =======================
// Rotação em torno do próprio eixo do objeto
// =======================
export function rotateX(mat, angle, cx = 0, cy = 0, cz = 0) {
    let m = translate(mat, -cx, -cy, -cz);
    m = multiplyMatrices(m, rotateXMatrix(angle));
    return translate(m, cx, cy, cz);
}

export function rotateY(mat, angle, cx = 0, cy = 0, cz = 0) {
    let m = translate(mat, -cx, -cy, -cz);
    m = multiplyMatrices(m, rotateYMatrix(angle));
    return translate(m, cx, cy, cz);
}

export function rotateZ(mat, angle, cx = 0, cy = 0, cz = 0) {
    let m = translate(mat, -cx, -cy, -cz);
    m = multiplyMatrices(m, rotateZMatrix(angle));
    return translate(m, cx, cy, cz);
}