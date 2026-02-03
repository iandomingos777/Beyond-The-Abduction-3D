attribute vec3 position;
attribute vec2 texCoord; // Coordenada UV vinda do buffer

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;

varying vec2 vTexCoord;

void main() {
    vTexCoord = texCoord; 
    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(position, 1.0);
}