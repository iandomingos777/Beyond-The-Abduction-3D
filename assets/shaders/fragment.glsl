precision mediump float;

uniform vec3 uColor;
uniform sampler2D uSampler; // textura
uniform bool uUseTexture;   // Flag para saber se usar textura ou cor sólida

varying vec2 vTexCoord;     // Recebido do Vertex

void main() {
    if (uUseTexture) {
        // Multiplica a textura pela cor (permite "tingir" a textura)
        vec4 texColor = texture2D(uSampler, vTexCoord);
        gl_FragColor = texColor * vec4(uColor, 1.0); 
    } else {
        gl_FragColor = vec4(uColor, 1.0);
    }
}