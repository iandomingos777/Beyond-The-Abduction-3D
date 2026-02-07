attribute vec3 position;
attribute vec2 texCoord;
attribute vec3 normal; // Recebe a normal do buffer

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;

varying vec2 vTexCoord;
varying vec3 vNormal;   // Envia para o fragment
varying vec3 vFragPos;  // Posição do pixel no mundo 3D

void main() {
    vTexCoord = texCoord;

    // Calcula a posição no mundo (sem view/projection no momento) para iluminação
    vec4 worldPosition = uModelMatrix * vec4(position, 1.0);
    vFragPos = vec3(worldPosition);

    // Calcula a normal rotacionada (Matriz Model).
    // Nota: Para escalas não uniformes, o correto seria mat3(transpose(inverse(uModelMatrix)))
    // Mas para rotação/translação simples, isso basta e é mais performático:
    vNormal = mat3(uModelMatrix) * normal;

    gl_Position = uProjectionMatrix * uViewMatrix * worldPosition;
}