# Gabrielzito: Beyond the Abduction - Jogo 3D (WebGL)

Este documento descreve a estrutura técnica e o design do jogo **Gabrielzito: Beyond the Abduction**, um jogo 3D de stealth e exploração desenvolvido usando WebGL puro.

## Conceito do Jogo

**Gabrielzito** foi abduzido e agora está preso dentro da nave alienígena. O jogador deve:

- 🎯 **Explorar** o ambiente 3D em busca de itens especiais
- 🔍 **Coletar** objetos espalhados em diferentes posições (x, y, z)
- 👁️ **Evitar** ser detectado pelas câmeras de vigilância dos aliens
- 🚪 **Escapar** da nave após coletar todos os itens necessários

### Mecânicas Principais

1. **Movimentação 3D:** WASD para navegar pelo ambiente
2. **Coleta de Itens:** Pressionar SPACE quando próximo a um item
3. **Sistema de Stealth:** Câmeras alienígenas que detectam o jogador
4. **Exploração:** Busca por itens em coordenadas variadas do cenário

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

### Sistemas de Gameplay (A Implementar)

#### Sistema de Coleta de Itens
- **src/systems/itemCollection.js**: lógica de detecção de proximidade e coleta
  - Verificar distância entre jogador e itens
  - Trigger de coleta (tecla SPACE)
  - Feedback visual/sonoro
  - Atualização do inventário

#### Sistema de Câmeras Alienígenas
- **src/systems/surveillance.js**: sistema de detecção de visibilidade
  - Posicionamento das câmeras no cenário
  - Cálculo de cone de visão
  - Detecção do jogador no campo de visão
  - Sistema de alerta/consequências

#### Sistema de Movimento do Jogador
- **src/systems/playerController.js**: controle de movimentação
  - Input WASD
  - Física básica (velocidade, aceleração)
  - Detecção de colisões (opcional)
  - Atualização da posição da câmera

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

- **src/entities/**: entidades do jogo
  - `player.js`: estado e propriedades do jogador (posição, inventário)
  - `collectible.js`: itens coletáveis espalhados pelo mapa
  - `camera.js`: câmeras alienígenas de vigilância
- **src/systems/**: sistemas independentes
  - `playerController.js`: controle de movimentação do jogador
  - `itemCollection.js`: sistema de coleta de itens
  - `surveillance.js`: sistema de câmeras e detecção
  - `input.js`: gerenciamento de input (teclado/mouse)
  - `collision.js`: detecção de colisões (se necessário)
- **src/managers/**: gerenciadores globais
  - `gameState.js`: estado do jogo (itens coletados, game over, vitória)
  - `sceneManager.js`: gerenciamento da cena
  - `assetManager.js`: carregamento de assets
- **src/ui/**: interface do usuário
  - `hud.js`: HUD mostrando itens coletados, avisos
  - `menu.js`: menus (start, pause, game over)

## O que o código atual faz

- **index.html**: inicializa a página, cria o canvas e carrega `src/main.js` como módulo ES6.
- **src/main.js**:
  - Inicializa WebGL.
  - Carrega os shaders externos em `assets/shaders/`.
  - Carrega modelos 3D (UFO, lata) via `objLoader.js`.
  - Cria um cubo simples (`Cube.js`).
  - Configura matrizes de projeção e câmera (perspectiva + lookAt).
  - Carrega texturas para objetos.
  - Executa o loop principal, atualizando e desenhando objetos 3D com rotação.
- **assets/shaders/vertex.glsl** e **fragment.glsl**: shaders básicos para renderização com cor e textura.
- **src/core/**: funções auxiliares para contexto, shaders, carregamento de OBJ e texturas.
- **src/core/objLoader.js**: leitor próprio de arquivos OBJ (atende requisito obrigatório).

## Próximos Passos de Implementação

### 1. Sistema de Iluminação Phong (Obrigatório)
- [ ] Implementar componente ambiente nos shaders
- [ ] Implementar componente difusa (produto escalar normal/luz)
- [ ] Implementar componente especular (reflexão)
- [ ] Adicionar pelo menos uma luz móvel

### 2. Mecânicas de Gameplay
- [ ] Sistema de movimentação do jogador (WASD)
- [ ] Sistema de coleta de itens (SPACE)
- [ ] Posicionar itens coletáveis no cenário
- [ ] Criar câmeras alienígenas no ambiente
- [ ] Implementar detecção de visibilidade
- [ ] Sistema de game over/vitória

### 3. Cenário e Assets
- [ ] Modelar/importar ambiente da nave alienígena
- [ ] Criar ou importar modelos de itens coletáveis
- [ ] Criar ou importar modelos de câmeras
- [ ] Aplicar texturas apropriadas ao tema

### 4. Polish e UI
- [ ] HUD mostrando progresso de coleta
- [ ] Feedback visual ao coletar itens
- [ ] Indicador de detecção pelas câmeras
- [ ] Sons ambiente e efeitos sonoros

## Execução local

Para testar localmente, use um servidor HTTP simples (por exemplo, Python):

```
python3 -m http.server 8000
```

Depois acesse: `http://localhost:8000`
