precision mediump float;

varying vec3 vNormal;
varying vec3 vFragPos;

uniform vec3 uLightPos; // Posição da luz
uniform vec3 uColor;    // Cor do objeto

void main() {
    vec3 norm = normalize(vNormal);
    vec3 lightDir = normalize(uLightPos - vFragPos);
    
    // Difusa: quanto a face aponta para a luz?
    float diff = max(dot(norm, lightDir), 0.0);
    
    // Ambiente: luz base para nada ficar 100% preto
    vec3 ambient = 0.2 * uColor;
    vec3 diffuse = diff * uColor;
    
    gl_FragColor = vec4(ambient + diffuse, 1.0);
}