attribute vec2 position;
attribute vec4 color;

varying vec4 vColor;

void main() {
    vColor = color;
    gl_Position = vec4(position, 0.0, 1.0);
}
