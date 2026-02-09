// fragment.glsl
precision highp float;

#define MAX_SPOTLIGHTS 8

uniform vec3 uColor;
uniform sampler2D uSampler;
uniform bool uUseTexture;

uniform vec3 uLightPos;       // posição da luz (mundo)
uniform vec3 uLightColor;
uniform vec3 uAmbientColor;   // cor ambiente global
uniform vec3 uViewPos;        // posição da câmera (mundo)

uniform float uKa;
uniform float uKd;
uniform vec3  uKs;
uniform float uShininess;

// Debug mode: 0 = off, 1 = show distance, 2 = show normal, 3 = show dot(N,L), 4 = show attenuation
// uniform int uDebugMode;

varying vec2 vTexCoord;
varying vec3 vWorldNormal;
varying vec3 vFragPos;

// --- CORREÇÃO: Spotlight como ARRAYS ---
uniform vec3 uSpotPos[MAX_SPOTLIGHTS];
uniform vec3 uSpotDir[MAX_SPOTLIGHTS];
uniform vec3 uSpotColor[MAX_SPOTLIGHTS];
uniform float uInnerCutoff[MAX_SPOTLIGHTS];
uniform float uOuterCutoff[MAX_SPOTLIGHTS];

void main() {
    // Pega a cor base da textura (ou Branco se não tiver textura)
    vec4 texColor = uUseTexture ? texture2D(uSampler, vTexCoord) : vec4(1.0, 1.0, 1.0, 1.0);

    // Multiplica pela cor do objeto (Tinting / Blend)
    vec4 objectColor = texColor * vec4(uColor, 1.0);

    vec3 N = normalize(vWorldNormal);
    vec3 L = normalize(uLightPos - vFragPos);
    vec3 V = normalize(uViewPos - vFragPos);

    // distância e atenuação
    float dist = length(uLightPos - vFragPos);
    float constant = 1.0;
    float linear = 0.008; 
    float quadratic = 0.0004;
    float attenuation = 1.0 / (constant + linear * dist + quadratic * dist * dist);

    // Ambiente
    vec3 ambient = uAmbientColor * objectColor.rgb * uKa;

    // Difuso (Lambert)
    float diff = max(dot(N, L), 0.0);
    vec3 diffuse = diff * uLightColor * objectColor.rgb * uKd;

    // Especular (Blinn-Phong)
    vec3 H = normalize(L + V);
    float spec = pow(max(dot(N, H), 0.0), uShininess);
    vec3 specular = spec * uKs * uLightColor;

    // Aplica atenuação a difusa e especular
    diffuse *= attenuation;
    specular *= attenuation;

    vec3 color = ambient + diffuse + specular;

    // --- LUZ 2: LANTERNAS (LOOP) ---
    vec3 totalSpotlight = vec3(0.0);

    for(int i = 0; i < MAX_SPOTLIGHTS; i++) {
        // Direção do fragmento até a lanterna 'i'
        vec3 sLightDir = normalize(uSpotPos[i] - vFragPos);
        
        // Cosseno do ângulo entre a luz e a direção da lanterna
        float theta = dot(sLightDir, normalize(-uSpotDir[i]));
        
        // Intensidade do cone (Suavização da borda)
        float epsilon = uInnerCutoff[i] - uOuterCutoff[i];
        float intensity = clamp((theta - uOuterCutoff[i]) / epsilon, 0.0, 1.0);
        
        // Atenuação por distância (evita que a luz brilhe no infinito)
        float dist = length(uSpotPos[i] - vFragPos);
        float attenuation = 1.0 / (1.0 + 0.045 * dist + 0.0075 * (dist * dist));
        
        // Difusa da lanterna
        float sDiff = max(dot(N, sLightDir), 0.0);
        
        // Soma o brilho desta lanterna ao acumulador
        totalSpotlight += (uSpotColor[i] * sDiff * intensity * attenuation * objectColor.rgb);
    }

    gl_FragColor = vec4(color + totalSpotlight, objectColor.a);
}
