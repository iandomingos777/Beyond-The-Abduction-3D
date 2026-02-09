// vertex.glsl
attribute vec3 position;
attribute vec2 texCoord;
attribute vec3 normal;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat3 uNormalMatrix; // inverse-transpose da parte 3x3 de uModelMatrix

varying vec2 vTexCoord;
varying vec3 vWorldNormal;
varying vec3 vFragPos;

void main() {
    vTexCoord = texCoord;

    // posição em espaço mundo
    vec4 worldPosition = uModelMatrix * vec4(position, 1.0);
    vFragPos = worldPosition.xyz;

    // normal corretamente transformada para espaço mundo
    vWorldNormal = normalize(uNormalMatrix * normal);

    // posição final na tela
    gl_Position = uProjectionMatrix * uViewMatrix * worldPosition;
}
