precision mediump float;

uniform vec3 uColor;

void main() {
    // Pinta o pixel com a cor sólida definida no JavaScript
    gl_FragColor = vec4(uColor, 1.0);
}