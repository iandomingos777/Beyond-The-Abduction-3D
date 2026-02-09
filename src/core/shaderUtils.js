export function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert('Erro shader: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

export function createProgram(gl, vertexShader, fragmentShader) {
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        alert('Erro program: ' + gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
        return null;
    }
    return program;
}

// Retorna Float32Array(9) = inverse(transpose(mat3(modelMatrix)))
export function computeNormalMatrixFromMat4(modelMat4) {
    // modelMat4 is a Float32Array or array of length 16, column-major (WebGL style)
    // Extract 3x3 (column-major)
    const m = modelMat4;
    const a00 = m[0],
        a01 = m[1],
        a02 = m[2];
    const a10 = m[4],
        a11 = m[5],
        a12 = m[6];
    const a20 = m[8],
        a21 = m[9],
        a22 = m[10];

    // Compute determinant
    const det =
        a00 * (a11 * a22 - a12 * a21) -
        a01 * (a10 * a22 - a12 * a20) +
        a02 * (a10 * a21 - a11 * a20);

    // If singular, return identity 3x3
    if (Math.abs(det) < 1e-8) {
        return new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]);
    }

    const invDet = 1.0 / det;

    // Inverse 3x3 (row-major conceptually, but keep column-major for GL)
    // Using formula for inverse of 3x3: inv = adjugate / det
    const i00 = (a11 * a22 - a12 * a21) * invDet;
    const i01 = -(a01 * a22 - a02 * a21) * invDet;
    const i02 = (a01 * a12 - a02 * a11) * invDet;

    const i10 = -(a10 * a22 - a12 * a20) * invDet;
    const i11 = (a00 * a22 - a02 * a20) * invDet;
    const i12 = -(a00 * a12 - a02 * a10) * invDet;

    const i20 = (a10 * a21 - a11 * a20) * invDet;
    const i21 = -(a00 * a21 - a01 * a20) * invDet;
    const i22 = (a00 * a11 - a01 * a10) * invDet;

    // Now we need the transpose of the inverse (inverse-transpose).
    // Transpose the inv matrix produced above.
    return new Float32Array([i00, i10, i20, i01, i11, i21, i02, i12, i22]);
}
