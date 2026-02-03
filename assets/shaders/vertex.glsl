attribute vec3 position;
attribute vec3 normal;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;

varying vec3 vNormal; // Passar normal para o fragment
varying vec3 vFragPos; // Posição do fragmento no mundo

void main() {
    // Calcula posição no mundo
    vec4 worldPos = uModelMatrix * vec4(position, 1.0);
    vFragPos = worldPos.xyz;
    
    // Normal precisa rotacionar com o objeto (matriz normal é o ideal, mas model serve para testes simples sem escala não-uniforme)
    vNormal = mat3(uModelMatrix) * normal; 

    gl_Position = uProjectionMatrix * uViewMatrix * worldPos;
}