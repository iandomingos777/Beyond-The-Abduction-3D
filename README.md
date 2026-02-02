# CG - Jogo 3D (WebGL)

Este projeto é a base para o desenvolvimento de um jogo 3D usando WebGL puro. A estrutura abaixo foi preparada para facilitar a organização do código e atender aos requisitos da disciplina.

## Estrutura do projeto

```
.
├── index.html
├── assets/
│   ├── shaders/
│   │   ├── vertex.glsl
│   │   └── fragment.glsl
│   ├── textures/
│   ├── models/
│   └── sounds/
├── docs/
│   └── trabalho2-CG.txt
└── src/
    ├── main.js
    ├── core/
    │   ├── glContext.js
    │   ├── shaderProgram.js
    │   ├── shaderUtils.js
    │   └── objLoader.js
    └── geometries/
        └── Cube.js
```

## Onde adicionar cada coisa no futuro

### Entrada principal
- **src/main.js**: ponto de entrada do jogo. Aqui ficam o loop principal, a inicialização do WebGL, a criação dos objetos e a chamada dos sistemas (física, input, câmera, etc.).

### Shaders
- **assets/shaders/**: coloque aqui todos os shaders GLSL.
  - `vertex.glsl`: vertex shader
  - `fragment.glsl`: fragment shader

### Texturas
- **assets/textures/**: imagens usadas como texturas (PNG, JPG, etc.).

### Modelos 3D (OBJ)
- **assets/models/**: arquivos `.obj` e materiais associados.

### Sons
- **assets/sounds/**: efeitos sonoros e músicas.

### Núcleo WebGL (infraestrutura)
- **src/core/**: utilidades e classes base do WebGL.
  - `glContext.js`: criação e validação do contexto WebGL
  - `shaderUtils.js`: compilação e link de shaders
  - `shaderProgram.js`: classe para encapsular programas de shader
  - `objLoader.js`: leitor de arquivos OBJ (obrigatório para o jogo 3D)

### Geometrias
- **src/geometries/**: geometrias procedurais (ex.: cubo, plano, esfera).
  - `Cube.js`: exemplo atual de geometria simples

### Sugestão para próximos diretórios
Quando começar a adicionar mais funcionalidades, recomenda-se criar:

- **src/entities/**: entidades do jogo (jogador, inimigos, itens, projéteis)
- **src/systems/**: sistemas independentes (física, input, câmera, colisões)
- **src/managers/**: gerenciadores globais (estado do jogo, cenas, assets)
- **src/ui/**: interface do usuário (menus, HUD)

## O que o código atual faz

- **index.html**: inicializa a página, cria o canvas e carrega `src/main.js` como módulo ES6.
- **src/main.js**:
  - Inicializa WebGL.
  - Carrega os shaders externos em `assets/shaders/`.
  - Cria um cubo simples (`Cube.js`).
  - Configura matrizes de projeção e câmera (perspectiva + lookAt).
  - Executa o loop principal, atualizando e desenhando o cubo (com rotação).
- **assets/shaders/vertex.glsl** e **fragment.glsl**: shaders mínimos para renderizar com cor por vértice.
- **src/core/**: funções auxiliares para contexto, shaders e base do leitor OBJ.

## Execução local

Para testar localmente, use um servidor HTTP simples (por exemplo, Python):

```
python3 -m http.server 8000
```

Depois acesse: `http://localhost:8000`
