precision mediump float;

uniform vec3 uColor;
uniform sampler2D uSampler;
uniform bool uUseTexture;

// Propriedades da Luz (Globais)
uniform vec3 uLightPos;
uniform vec3 uLightColor;
uniform vec3 uAmbientColor; // Cor base da luz ambiente da cena
uniform vec3 uViewPos;

// --- UNIFORMS DE MATERIAL (Por Objeto) ---
uniform float uKa;        // Coeficiente Ambiente (0.0 a 1.0)
uniform float uKd;        // Coeficiente Difuso (0.0 a 1.0)
uniform vec3  uKs;        // Cor/Intensidade Especular (ex: branco [1,1,1])
uniform float uShininess; // Brilho do material

varying vec2 vTexCoord;
varying vec3 vNormal;
varying vec3 vFragPos;

void main() {
    // 1. Cor Base do Objeto
    vec4 objectColor;
    if (uUseTexture) {
        objectColor = texture2D(uSampler, vTexCoord) * vec4(uColor, 1.0);
    } else {
        objectColor = vec4(uColor, 1.0);
    }
    
    if(objectColor.a < 0.1) discard;

    // Normalização
    vec3 norm = normalize(vNormal);
    vec3 lightDir = normalize(uLightPos - vFragPos);
    vec3 viewDir = normalize(uViewPos - vFragPos);

    // --- CÁLCULO DE PHONG ---

    // A. Ambiente: (Luz Ambiente Global * Cor do Objeto * Coeficiente do Material)
    vec3 ambient = uAmbientColor * objectColor.rgb * uKa;

    // B. Difusa: (Luz * Cor do Objeto * Lambert * Coeficiente do Material)
    float diff = max(dot(norm, lightDir), 0.0);
    vec3 diffuse = diff * uLightColor * objectColor.rgb * uKd;

    // C. Especular: (Luz * Cor Especular do Material * Phong)
    // Agora usa uKs em vez de uLightColor direto, permitindo mudar a cor do brilho
    vec3 reflectDir = reflect(-lightDir, norm);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), uShininess);
    vec3 specular = spec * uKs; 

    vec3 finalColor = ambient + diffuse + specular;
    gl_FragColor = vec4(finalColor, objectColor.a);
}