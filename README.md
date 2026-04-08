# Gabrielzito: Beyond the Abduction (3D)

## Overview

This project corresponds to **Assignment 2 (Second Partial Evaluation – Weight 2)** for the **Computer Graphics** course and consists of the development of a **3D Game**, using **exclusively pure WebGL** (without high-level graphics libraries like three.js).

The project is a **direct narrative continuation** of the game developed in Assignment 1 (_Gabrielzito Abduction Arcade Game – 2D_). In this new stage, the character Gabrielzito finds himself **inside the alien ship**, exploring the environment in search of items to escape while avoiding detection by the aliens' surveillance cameras.

## Demonstration Video

A video demonstrating the game's execution:


https://github.com/user-attachments/assets/9cb99fc8-c336-4426-8c8d-b851ae4156f5


## Gameplay

**Gabrielzito: Beyond the Abduction** is a 3D stealth and exploration game. Gabrielzito is trapped inside an alien ship with multiple rooms and corridors. The main objective is to traverse the rooms and reach the Escape Room without being detected. The challenge lies in the alien surveillance cameras patrolling the environment—if Gabrielzito is detected by the cameras' light, it is GAME OVER!

### Controls

- `W` `A` `S` `D` - Movement (forward, left, backward, right)
- `Mouse` - Look direction
- `SPACE` - Jump / Press button in the Escape Room
- `B` - Building Mode (fly/noclip for debugging)
- `ESC` - Open pause menu

### Core Loop

1. **Explore** the alien ship's rooms and corridors.
2. **Avoid** being detected by surveillance cameras.
3. **Reach** the Escape Room.
4. **Escape** by pressing SPACE on the exit platform.

### Main Mechanics

**Camera System (Stealth):** Surveillance cameras with rotating spotlights are positioned in different rooms. A visible light cone indicates the detection area, and detection is instant if the player is illuminated, resulting in capture. The player must strategize by observing rotation patterns, waiting for the right moment, and utilizing blind spots. The cameras feature different colors for visual identification (cyan, red, green).

**Win Condition:** The player must cross all rooms undetected, reach the final Escape Room, and press SPACE on the escape platform to trigger the victory screen.

## Scenario and Setting

**Environment:** The theme is the interior of an alien ship/space base, featuring a sci-fi, metallic aesthetic with dynamic lighting. The structure consists of multiple rooms interconnected by corridors.

**Lighting (Phong):** The game features a dynamic lighting system based on the Phong reflection model. There is a main light that transitions colors as the player advances, along with spotlights from the security cameras. Materials are designed to simulate metal, fabric, plastic, and wood with accurate physical properties.

**Objects:** The ship's walls and structures use metallic textures. The environment is populated with decorative objects such as sofas, an old TV, a Buddha statue, and an alien. Other elements include vehicles (UFO, police car), stacked wooden boxes, street and surgical lamps, rotating surveillance cameras, and the final escape platform.

## Objectives

The main goals of this project include developing a 3D stealth game where the player must escape an alien ship, applying fundamental concepts of **3D Computer Graphics**, and manually implementing essential parts of the **graphics pipeline**. This involves developing an interactive 3D scene with a first-person camera, implementing **realistic lighting** using the Phong model with multiple light sources, and creating a spotlight-based detection system. Additional objectives encompass implementing movement mechanics, collision, environment interaction, Game Over/Victory systems, and maintaining a **modular, organized, and documented** code architecture.

## Project Requirements (Summary)

The complete academic requirements are described in `docs/professor_requirements.md`. Key technical implementations include:

- First-person camera navigation through the 3D environment with a collision system.
- Lighting based on the **Phong reflection model** with multiple light sources.
- 3D objects loaded from **OBJ** files using a **custom OBJ loader** (mandatory implementation).
- 3D objects animated via geometric transformations (rotating cameras).
- Use of **textures** and **solid colors**.
- Rendering executed exclusively with **pure WebGL**.
- Interaction via keyboard and mouse (WASD + Mouse + SPACE + ESC).
- Gameplay systems including stealth mechanics, camera detection, item collection, a main menu, pause system, and win/loss conditions.

## Computer Graphics Concepts Used

- 3D graphics pipeline
- 4x4 homogeneous matrices
- Geometric transformations (translation, rotation, and scale)
- Virtual camera and perspective projection
- Ambient, diffuse, and specular lighting (Phong)
- Texturing and UV mapping
- Programmable shaders (GLSL)
- 3D model loading (OBJ format)
- Collision detection and interaction with objects
- Visibility system for stealth mechanics

## Repository Organization

```text
.
├── index.html                 # Main page with WebGL canvas
├── README.md                  # This file
│
├── assets/
│   ├── shaders/              # GLSL Shaders (vertex and fragment)
│   ├── textures/             # PNG/JPG Textures
│   │   ├── metal-wall1.jpg
│   │   ├── scifi_floor.png
│   │   ├── exit.jpg
│   │   └── ... (model textures)
│   ├── models/               # OBJ 3D Models
│   │   ├── chess/           # Chess pieces
│   │   ├── Alien.obj
│   │   ├── buddha_lowpoly.obj
│   │   ├── carPolice.obj
│   │   ├── Low_poly_UFO.obj
│   │   └── ... (other models)
│   └── soundtrack.ogg        # Background music
│
├── src/
│   ├── main.js               # Main Game class and render loop
│   ├── core/                 # Core WebGL system
│   │   ├── glContext.js      # WebGL context initialization
│   │   ├── shaderUtils.js    # Shader compilation
│   │   ├── shaderProgram.js  # Program management
│   │   ├── objLoader.js      # Custom OBJ file loader
│   │   ├── textureLoader.js  # Texture loading
│   │   ├── draw.js           # Rendering functions
│   │   ├── camera.js         # FPS Camera
│   │   ├── light.js          # Lighting system
│   │   ├── input.js          # Input capture (keyboard/mouse)
│   │   └── audio.js          # Audio management
│   ├── systems/              # Game systems
│   │   └── collision.js      # AABB collision system
│   ├── scenes/               # Scene configuration
│   │   └── environment.js    # Environment colliders setup
│   ├── models/               # Game entities
│   │   ├── player.js         # Player logic
│   │   └── camlight.js       # Surveillance cameras with spotlight
│   ├── geometries/           # Procedural geometries
│   │   └── cube.js           # Cube generation
│   ├── math/                 # Math library
│   │   └── mat4.js           # 4x4 matrix operations
│   └── menu/                 # User interface
│       ├── mainMenu.js       # Main menu and pause
│       └── menuStyles.css    # Menu styles
│
└── video_demo.mp4            # Demonstration video (final delivery)
```

## Running the Project

Due to browser security restrictions, the project must be executed from a **local HTTP server**.

Example using Python:

```bash
python3 -m http.server 8000
```

Then, access it in your browser:

```text
http://localhost:8000
```

## Credits

Project developed as a continuation of **Gabrielzito Abduction (2D)** for the **Computer Graphics** course.
