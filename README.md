# Gabrielzito: Beyond the Abduction (3D)

## Overview

Este projeto corresponde ao **Trabalho 2 (Segunda Avaliação Parcial – Peso 2)** da disciplina de **Computação Gráfica** e consiste no desenvolvimento de um **Jogo 3D**, utilizando **exclusivamente WebGL puro** (sem bibliotecas gráficas de alto nível, como three.js).

O projeto é uma **continuação narrativa direta** do jogo desenvolvido no Trabalho 1 (_Gabrielzito Abduction Arcade Game – 2D_). Nesta nova etapa, o personagem Gabrielzito se encontra **dentro da nave alienígena**, explorando o ambiente em busca de itens para escapar enquanto evita ser detectado pelas câmeras de vigilância dos aliens.

## Gameplay

**Gabrielzito: Beyond the Abduction** é um jogo 3D de stealth e exploração onde:

- 🚀 **Cenário:** Gabrielzito está preso no espaço dos aliens, dentro de uma nave ou base espacial
- 🎯 **Objetivo:** Procurar e coletar itens espalhados pelo ambiente 3D (em diferentes coordenadas x, y, z) para tentar escapar
- 👁️ **Desafio:** Aliens vigiam o ambiente com câmeras de segurança - Gabrielzito não pode ser visto!

### Controles

- `W` - Avançar
- `A` - Mover para esquerda
- `S` - Recuar
- `D` - Mover para direita
- `Mouse` - Controlar direção do olhar (opcional)
- `SPACE` - Interagir/Coletar item

### Core Loop

1. **Explorar** o ambiente 3D da nave alienígena
2. **Localizar** itens espalhados em diferentes posições (x, y, z)
3. **Aproximar-se** dos itens sem ser detectado pelas câmeras
4. **Coletar** pressionando SPACE quando próximo
5. **Escapar** após reunir todos os itens necessários

### Mecânicas Principais

**Sistema de Coleta:**
- Objetos especiais espalhados pelo cenário da nave
- Jogador precisa estar próximo do item (raio de ~2 unidades)
- Pressionar SPACE para coletar
- Feedback visual: item desaparece com animação
- HUD atualiza contador de itens (ex: "3/5 itens coletados")

**Sistema de Câmeras (Stealth):**
- Câmeras posicionadas estrategicamente pelo ambiente
- Animação de rotação/varredura com cone de visão
- Sistema de line-of-sight para detecção
- Tempo de detecção: ~2 segundos olhando diretamente
- Consequência: teleporte ao início, sistema de strikes, ou game over
- Estratégia: observar padrões, aguardar momento certo, explorar pontos cegos

**Condição de Vitória:**
- Coletar todos os itens necessários
- Chegar à zona de escape (porta/saída)

---

## Cenário e Ambientação

**Ambiente:**
- Tema: Interior de nave alienígena / base espacial
- Estética: Sci-fi, metálico, iluminação neon
- Estrutura: Corredores, salas interconectadas, áreas abertas

**Iluminação (Phong):**
- Luz ambiente baixa, criando atmosfera sombria
- Luzes pontuais: painéis iluminados, computadores alien
- Luz móvel: hologram rotativo, laser varredura (requisito obrigatório)

**Objetos:**
- Paredes e estrutura da nave
- Painéis de controle alien
- Caixas/containers
- Câmeras de vigilância
- Itens coletáveis
- Porta de escape

---

## Objetivos

- Desenvolver um jogo 3D de stealth e exploração com mecânicas de coleta de itens
- Aplicar conceitos fundamentais de **Computação Gráfica 3D**
- Implementar manualmente partes essenciais do **pipeline gráfico**
- Desenvolver uma cena 3D interativa com câmera em perspectiva
- Implementar **iluminação realista** utilizando o modelo de Phong
- Criar sistema de detecção de visibilidade (câmeras alienígenas)
- Implementar mecânicas de coleta de objetos e interação com o ambiente
- Manter uma arquitetura de código **modular, organizada e documentada**

---

## Requisitos do Projeto (Resumo)

Os requisitos acadêmicos completos estão descritos em `docs/professor_requirements.md`.

De forma geral, o projeto contempla os **Requisitos Específicos para Jogo 3D**:

- Câmera com **projeção perspectiva** (primeira ou terceira pessoa)
- Movimentação do jogador pelo ambiente 3D
- Iluminação baseada no **modelo de reflexão de Phong**
- Objetos 3D carregados de arquivos **OBJ**
- **Leitor próprio de arquivos OBJ** (implementação obrigatória)
- Objetos 3D animados por transformações geométricas
- Uso de **texturas** e **cores sólidas**
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
├── index.html                 # Inicialização do canvas e carregamento do app
├── README.md
│
├── docs/
│   ├── professor_requirements.md   # Checklist acadêmico
│   ├── technical_draft.md          # Planejamento técnico WebGL
│   ├── game_design.md              # Game Design Document detalhado
│   ├── trabalho2-CG.txt            # Requisitos originais do professor
│   └── presentation.md             # Slides da apresentação (futuro)
│
├── assets/
│   ├── shaders/              # Shaders GLSL
│   │   ├── vertex.glsl
│   │   └── fragment.glsl
│   ├── textures/             # Texturas
│   ├── models/               # Modelos 3D (OBJ, se aplicável)
│   └── sounds/               # Áudios (opcional)
│
├── src/
│   ├── main.js               # Ponto de entrada e loop principal
│   ├── core/                 # Infraestrutura WebGL
    │   ├── draw.js
│   │   ├── glContext.js
│   │   ├── shaderUtils.js
│   │   ├── shaderProgram.js
│   │   └── objLoader.js      # Leitor próprio de OBJ (quando aplicável)
│   ├── systems/              # Sistemas independentes
│   │   ├── camera.js
│   │   ├── lighting.js
│   │   └── input.js
│   ├── geometries/           # Geometrias procedurais
│   │   └── cube.js
│   └── entities/             # Entidades da cena
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

## Documentação Complementar

O projeto possui documentação detalhada em `docs/`:

- **[professor_requirements.md](docs/professor_requirements.md)** - Checklist completo dos requisitos acadêmicos com status de implementação
- **[game_design.md](docs/game_design.md)** - Game Design Document com mecânicas detalhadas, gameplay loop e milestones
- **[technical_draft.md](docs/technical_draft.md)** - Documentação técnica da estrutura WebGL e próximos passos de implementação
- **trabalho2-CG.txt** - Requisitos originais fornecidos pelo professor

---

## Metodologia de Desenvolvimento

- Desenvolvimento incremental baseado em gameplay
- Implementação progressiva dos requisitos técnicos
- Foco em mecânicas de jogo (coleta de itens, sistema de detecção)
- Organização modular do código
- Uso de documentação complementar em `docs/`

---

## Milestones de Desenvolvimento

### Fase 1: Core Graphics ✅
- ✅ Setup WebGL
- ✅ Shaders básicos
- ✅ Carregamento de OBJ
- ✅ Renderização de objetos

### Fase 2: Iluminação 🚧
- 🚧 Implementar Phong nos shaders
- 🚧 Adicionar fonte de luz móvel
- ⏳ Ajustar materiais dos objetos

### Fase 3: Gameplay Core 🎯
- ⏳ Input e movimentação
- ⏳ Sistema de coleta
- ⏳ Posicionar itens no cenário
- ⏳ HUD básico

### Fase 4: Stealth Mechanics 👁️
- ⏳ Criar câmeras de vigilância
- ⏳ Implementar detecção
- ⏳ Lógica de alerta/game over

### Fase 5: Polish & Content 🎨
- ⏳ Criar cenário completo da nave
- ⏳ Adicionar mais modelos
- ⏳ Menu e UI
- ⏳ Sons e efeitos (opcional)
- ⏳ Balanceamento

### Fase 6: Entrega Final 📦
- ⏳ Testes completos
- ⏳ Gravar vídeo demonstrativo
- ⏳ Preparar slides de apresentação
- ⏳ Documentação final
- ⏳ Deploy e entrega

Decisões técnicas e evoluções de implementação são documentadas na pasta `docs/`.

---

## Vídeo Demonstrativo

Um vídeo demonstrando a execução do projeto será disponibilizado ao final do desenvolvimento:

- **Link:** _(placeholder – a ser adicionado)_

---

## Créditos

Projeto desenvolvido como continuação de **Gabrielzito Abduction (2D)** para a disciplina de **Computação Gráfica**.
