precision mediump float;

#define MAX_SPOTLIGHTS 3

uniform vec3 uColor;
uniform sampler2D uSampler;
uniform bool uUseTexture;

// Luz Global
uniform vec3 uLightPos;
uniform vec3 uLightColor;
uniform vec3 uAmbientColor;
uniform vec3 uViewPos;

// Material
uniform float uKa;
uniform float uKd;
uniform vec3 uKs;
uniform float uShininess;

varying vec2 vTexCoord;
varying vec3 vNormal;
varying vec3 vFragPos;

// --- CORREÇÃO: Spotlight como ARRAYS ---
uniform vec3 uSpotPos[MAX_SPOTLIGHTS];
uniform vec3 uSpotDir[MAX_SPOTLIGHTS];
uniform vec3 uSpotColor[MAX_SPOTLIGHTS];
uniform float uInnerCutoff;
uniform float uOuterCutoff;

void main() {
    // 1. Cor Base
    vec4 objectColor;
    if (uUseTexture) {
        objectColor = texture2D(uSampler, vTexCoord) * vec4(uColor, 1.0);
    } else {
        objectColor = vec4(uColor, 1.0);
    }
    
    if(objectColor.a < 0.1) discard;

    // Normalização comum
    vec3 norm = normalize(vNormal);
    vec3 viewDir = normalize(uViewPos - vFragPos);

    // --- LUZ 1: GLOBAL (PHONG) ---
    vec3 lightDir = normalize(uLightPos - vFragPos);
    
    // Ambiente
    vec3 ambient = uAmbientColor * objectColor.rgb * uKa;

    // Difusa Global
    float diff = max(dot(norm, lightDir), 0.0);
    vec3 diffuse = diff * uLightColor * objectColor.rgb * uKd;

    // Especular Global
    vec3 reflectDir = reflect(-lightDir, norm);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), uShininess);
    vec3 specular = spec * uKs; 

    // --- LUZ 2: LANTERNAS (LOOP) ---
    vec3 totalSpotlight = vec3(0.0);

    for(int i = 0; i < MAX_SPOTLIGHTS; i++) {
        // Direção do fragmento até a lanterna 'i'
        vec3 sLightDir = normalize(uSpotPos[i] - vFragPos);
        
        // Cosseno do ângulo entre a luz e a direção da lanterna
        float theta = dot(sLightDir, normalize(-uSpotDir[i]));
        
        // Intensidade do cone (Suavização da borda)
        float epsilon = uInnerCutoff - uOuterCutoff;
        float intensity = clamp((theta - uOuterCutoff) / epsilon, 0.0, 1.0);
        
        // Atenuação por distância (evita que a luz brilhe no infinito)
        float dist = length(uSpotPos[i] - vFragPos);
        float attenuation = 1.0 / (1.0 + 0.045 * dist + 0.0075 * (dist * dist));
        
        // Difusa da lanterna
        float sDiff = max(dot(norm, sLightDir), 0.0);
        
        // Soma o brilho desta lanterna ao acumulador
        totalSpotlight += (uSpotColor[i] * sDiff * intensity * attenuation * objectColor.rgb);
    }

    // Resultado final: Ambiente + Difusa/Especular Global + Todas as Lanternas
    vec3 result = ambient + diffuse + specular + totalSpotlight;
    
    gl_FragColor = vec4(result, objectColor.a);
}