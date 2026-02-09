# Gabrielzito: Beyond the Abduction (3D)

## Overview

Este projeto corresponde ao **Trabalho 2 (Segunda Avaliação Parcial – Peso 2)** da disciplina de **Computação Gráfica** e consiste no desenvolvimento de um **Jogo 3D**, utilizando **exclusivamente WebGL puro** (sem bibliotecas gráficas de alto nível, como three.js).

O projeto é uma **continuação narrativa direta** do jogo desenvolvido no Trabalho 1 (_Gabrielzito Abduction Arcade Game – 2D_). Nesta nova etapa, o personagem Gabrielzito se encontra **dentro da nave alienígena**, explorando o ambiente em busca de itens para escapar enquanto evita ser detectado pelas câmeras de vigilância dos aliens.

## Gameplay

**Gabrielzito: Beyond the Abduction** é um jogo 3D de stealth e exploração onde:

- 🚀 **Cenário:** Gabrielzito está preso dentro de uma nave alienígena com múltiplas salas e corredores
- 🎯 **Objetivo:** Atravessar as salas e alcançar a Escape Room sem ser detectado pelas câmeras
- 👁️ **Desafio:** Câmeras de vigilância aliens patrulham o ambiente - se Gabrielzito for detectado pela luz das câmeras, é GAME OVER!

### Controles

- `W` `A` `S` `D` - Movimentação (frente, esquerda, trás, direita)
- `Mouse` - Controlar direção do olhar
- `SPACE` - Pular / Pressionar botão na Escape Room
- `B` - Modo Building (voar/atravessar paredes para debug)
- `ESC` - Abrir menu de pausa

### Core Loop

1. **Explorar** as salas e corredores da nave alienígena
2. **Evitar** ser detectado pelas câmeras de vigilância
3. **Alcançar** a Escape Room (sala de fuga)
4. **Escapar** pressionando SPACE na plataforma de saída

### Mecânicas Principais

**Sistema de Câmeras (Stealth):**
- Câmeras de vigilância com spotlight rotativo em diferentes salas
- Cone de luz visível indica área de detecção
- Detecção instantânea se o jogador for iluminado
- Consequência: GAME OVER - jogador foi capturado
- Estratégia: observar padrões de rotação, aguardar momento certo, usar pontos cegos
- Câmeras possuem cores diferentes para identificação visual (ciano, vermelho, verde)

**Condição de Vitória:**
- Atravessar todas as salas sem ser detectado
- Alcançar a Escape Room (sala final)
- Pressionar SPACE na plataforma de fuga para escapar

---

## Cenário e Ambientação

**Ambiente:**
- Tema: Interior de nave alienígena / base espacial
- Estética: Sci-fi, metálico, iluminação dinâmica
- Estrutura: Múltiplas salas interconectadas por corredores

**Iluminação (Phong):**
- Sistema de iluminação dinâmica baseado no modelo de Phong
- Luz principal que transição entre cores conforme o jogador avança
- Spotlights das câmeras de segurança (ciano, vermelho, verde)
- Materiais realistas: metal, tecido, plástico, madeira com propriedades físicas corretas

**Objetos:**
- Paredes e estrutura da nave com texturas metálicas
- Objetos decorativos: sofás, TV antiga, Buddha, alien
- Veículos: UFO, carro de polícia
- Caixas de madeira empilhadas
- Câmeras de vigilância com spotlight rotativo
- Lâmpadas de rua e cirúrgicas
- Plataforma de fuga na Escape Room
---

## Objetivos

- Desenvolver um jogo 3D de stealth onde o jogador deve escapar de uma nave alienígena
- Aplicar conceitos fundamentais de **Computação Gráfica 3D**
- Implementar manualmente partes essenciais do **pipeline gráfico**
- Desenvolver uma cena 3D interativa com câmera em primeira pessoa
- Implementar **iluminação realista** utilizando o modelo de Phong com múltiplas fontes de luz
- Criar sistema de detecção baseado em spotlight das câmeras alienígenas
- Implementar mecânicas de movimento, colisão e interação com o ambiente
- Sistema de Game Over por detecção e Victory Screen ao escapar
- Manter uma arquitetura de código **modular, organizada e documentada**

---

## Requisitos do Projeto (Resumo)

Os requisitos acadêmicos completos estão descritos em `docs/professor_requirements.md`.
em primeira pessoa
- Movimentação do jogador pelo ambiente 3D com sistema de colisão
- Iluminação baseada no **modelo de reflexão de Phong** com múltiplas fontes de luz
- Objetos 3D carregados de arquivos **OBJ**
- **Leitor próprio de arquivos OBJ** (implementação obrigatória)
- Objetos 3D animados por transformações geométricas (câmeras rotativas)
- Uso de **texturas** e **cores sólidas**
- Renderização feita exclusivamente com **WebGL puro**
- Interação via teclado e mouse (WASD + Mouse + SPACE + ESC)
- Sistema de gameplay: stealth, detecção por câmeras, mecânica de fuga
- Menu principal e sistema de pausa
- Condições de vitória e derrota
- Renderização feita exclusivamente com **WebGL puro**
- Interação via teclado (WASD + SPACE)
- Sistema de gameplay: coleta de itens, detecção por câmeras, mecânica de stealth

---

## Conceitos de Computação Gráfica Utilizados

- Pipeline gráfico 3D
- Matrizes homogêneas 4×4
- Transformações geométricas (translação, rotação e escala)
- Câmera virtual e projeção perspectiva
- Iluminação ambiente, difusa e especular (Phong)
- Texturização e mapeamento UV
- Shaders programáveis (GLSL)
- Carregamento de modelos 3D (formato OBJ)
- Detecção de colisões e interação com objetos
- Sistema de visibilidade para mecânica de stealth

---

## Organização do Repositório

```
.
├── index.html                 # Página principal com canvas WebGL
├── README.md                  # Este arquivo
│
├── assets/
│   ├── shaders/              # Shaders GLSL (vertex e fragment)
│   ├── textures/             # Texturas PNG/JPG
│   │   ├── metal-wall1.jpg
│   │   ├── scifi_floor.png
│   │   ├── exit.jpg
│   │   └── ... (texturas dos modelos)
│   ├── models/               # Modelos 3D OBJ
│   │   ├── chess/           # Peças de xadrez
│   │   ├── Alien.obj
│   │   ├── buddha_lowpoly.obj
│   │   ├── carPolice.obj
│   │   ├── Low_poly_UFO.obj
│   │   └── ... (outros modelos)
│   └── soundtrack.ogg        # Música de fundo
│
├── src/
│   ├── main.js               # Classe Game principal e loop de renderização
│   ├── core/                 # Sistema central WebGL
│   │   ├── glContext.js      # Inicialização do contexto WebGL
│   │   ├── shaderUtils.js    # Compilação de shaders
│   │   ├── shaderProgram.js  # Gerenciamento de programas
│   │   ├── objLoader.js      # Leitor próprio de arquivos OBJ
│   │   ├── textureLoader.js  # Carregamento de texturas
│   │   ├── draw.js           # Funções de renderização
│   │   ├── camera.js         # Câmera FPS
│   │   ├── light.js          # Sistema de iluminação
│   │   ├── input.js          # Captura de entrada (teclado/mouse)
│   │   └── audio.js          # Gerenciamento de áudio
│   ├── systems/              # Sistemas de jogo
│   │   └── collision.js      # Sistema de colisão AABB
│   ├── scenes/               # Configuração de cenas
│   │   └── environment.js    # Setup de colisores do ambiente
│   ├── models/               # Entidades do jogo
│   │   ├── player.js         # Lógica do jogador
│   │   └── camlight.js       # Câmeras de vigilância com spotlight
│   ├── geometries/           # Geometrias procedurais
│   │   └── cube.js           # Geração de cubo
│   ├── math/                 # Biblioteca matemática
│   │   └── mat4.js           # Operações com matrizes 4x4
│   └── menu/                 # Interface do usuário
│       ├── mainMenu.js       # Menu principal e pausa
│       └── menuStyles.css    # Estilos do menu
│
└── video_demo.mp4            # Vídeo demonstrativo (entrega final)
```

---

## Execução do Projeto

Por questões de segurança do navegador, o projeto deve ser executado a partir de um **servidor HTTP local**.

Exemplo utilizando Python:

````bash
python3 -m http.server 8000
```bash
python3 -m http.server 8000
````

Em seguida, acesse no navegador:

```
http://localhost:8000
```

---

## Vídeo Demonstrativo

Um vídeo demonstrando a execução do projeto será disponibilizado ao final do desenvolvimento:

- **Link:** _(placeholder – a ser adicionado)_

---

## Créditos

Projeto desenvolvido como continuação de **Gabrielzito Abduction (2D)** para a disciplina de **Computação Gráfica**.
