precision mediump float;

uniform vec3 uColor;
uniform sampler2D uSampler;
uniform bool uUseTexture;

// Uniforms de Iluminação
uniform vec3 uLightPos;
uniform vec3 uLightColor;
uniform vec3 uAmbientColor;
uniform vec3 uViewPos; // Posição da câmera (para o brilho especular)
uniform float uShininess;

varying vec2 vTexCoord;
varying vec3 vNormal;
varying vec3 vFragPos;

void main() {
    // 1. Cor Base do Objeto (Textura ou Cor Sólida)
    vec4 objectColor;
    if (uUseTexture) {
        objectColor = texture2D(uSampler, vTexCoord) * vec4(uColor, 1.0);
    } else {
        objectColor = vec4(uColor, 1.0);
    }

    // Se o alpha for baixo, descarta (opcional)
    if(objectColor.a < 0.1) discard;

    // --- CÁLCULO DE PHONG ---

    // Normalizar vetores (interpolação pode desnormalizar)
    vec3 norm = normalize(vNormal);
    vec3 lightDir = normalize(uLightPos - vFragPos);
    vec3 viewDir = normalize(uViewPos - vFragPos);

    // A. Ambiente
    vec3 ambient = uAmbientColor * objectColor.rgb;

    // B. Difusa (Lambert)
    // max(dot, 0.0) garante que luz vindo de trás não ilumine
    float diff = max(dot(norm, lightDir), 0.0);
    vec3 diffuse = diff * uLightColor * objectColor.rgb;

    // C. Especular (Blinn-Phong ou Phong tradicional)
    // Usando Phong tradicional (Reflect) como no exemplo do professor
    vec3 reflectDir = reflect(-lightDir, norm);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), uShininess);
    vec3 specular = spec * uLightColor; // Especular geralmente é a cor da luz (branco), não do objeto

    // Combina tudo
    vec3 finalColor = ambient + diffuse + specular;

    gl_FragColor = vec4(finalColor, objectColor.a);
}