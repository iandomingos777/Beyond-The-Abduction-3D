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
    // ... (cálculos de cor e normais mantidos iguais)

    vec3 norm = normalize(vNormal);
    vec3 lightDir = normalize(uLightPos - vFragPos);
    vec3 viewDir = normalize(uViewPos - vFragPos);

    // --- CÁLCULO DA DISTÂNCIA ---
    float distance = length(uLightPos - vFragPos);
    
    // Fórmula de atenuação (Constante + Linear + Quadrática)
    // Ajuste estes valores para controlar o alcance da luz
    float constant = 1.0;
    float linear = 0.09;
    float quadratic = 0.032;
    float attenuation = 1.0 / (constant + linear * distance + quadratic * (distance * distance));

    // --- CÁLCULO DE PHONG (Mantido) ---
    
    // A. Ambiente (Geralmente o ambiente não sofre atenuação forte, mas pode sofrer)
    vec3 ambient = uAmbientColor * objectColor.rgb * uKa; 
    
    // B. Difusa
    float diff = max(dot(norm, lightDir), 0.0);
    vec3 diffuse = diff * uLightColor * objectColor.rgb * uKd;
    
    // C. Especular
    vec3 reflectDir = reflect(-lightDir, norm);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), uShininess);
    vec3 specular = spec * uKs; // uKs já define a cor/intensidade do brilho

    // --- APLICA A ATENUAÇÃO ---
    // Multiplicamos a luz difusa e especular pela atenuação. 
    // O ambiente geralmente mantemos (ou atenuamos menos) para não ficar breu total.
    diffuse  *= attenuation;
    specular *= attenuation;

    vec3 finalColor = ambient + diffuse + specular;
    gl_FragColor = vec4(finalColor, objectColor.a);
}