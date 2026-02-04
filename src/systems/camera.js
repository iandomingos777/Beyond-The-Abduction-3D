import { createCamera } from '../math/mat4.js';

export
class Camera {
    constructor() {
        this.position = [0, 0, 5];
        this.up       = [0, 1, 0];

        this.yaw   = -90; // olhando para -Z
        this.pitch = 0;

        this.front = [0, 0, -1];
        this.speed = 4.0;
        this.sensitivity = 0.1;
    }

    updateDirection() {
        const radYaw   = this.yaw * Math.PI / 180;
        const radPitch = this.pitch * Math.PI / 180;

        this.front = [
            Math.cos(radYaw) * Math.cos(radPitch),
            Math.sin(radPitch),
            Math.sin(radYaw) * Math.cos(radPitch)
        ];

        // normaliza
        const len = Math.hypot(...this.front);
        this.front = this.front.map(v => v / len);
    }

    getViewMatrix() {
        const target = [
            this.position[0] + this.front[0],
            this.position[1] + this.front[1],
            this.position[2] + this.front[2]
        ];

        return createCamera(this.position, target, this.up);
    }

move(forward, right, dt) {
        const velocity = this.speed * dt;

        // forward vector
        this.position[0] += this.front[0] * forward * velocity;
        this.position[1] += this.front[1] * forward * velocity;
        this.position[2] += this.front[2] * forward * velocity;

        // right vector = front x up
        const rightVec = [
            this.front[2],
            0,
            -this.front[0]
        ];

        this.position[0] += rightVec[0] * right * velocity;
        this.position[2] += rightVec[2] * right * velocity;
    }

    // =========================
    // Mouse look
    // =========================
look(dx, dy) {
        this.yaw   += dx * this.sensitivity;
        this.pitch += dy * this.sensitivity;

        this.pitch = Math.max(-89, Math.min(89, this.pitch));

        this.updateDirection();
    }

}
