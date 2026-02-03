# Gabrielzito: Beyond the Abduction (3D)

## Overview

Este projeto corresponde ao **Trabalho 2 (Segunda Avaliação Parcial – Peso 2)** da disciplina de **Computação Gráfica** e consiste no desenvolvimento de um **Jogo 3D ou Passeio Virtual 3D**, utilizando **exclusivamente WebGL puro** (sem bibliotecas gráficas de alto nível, como three.js).

O projeto é uma **continuação narrativa direta** do jogo desenvolvido no Trabalho 1 (*Gabrielzito Abduction Arcade Game – 2D*). Nesta nova etapa, o personagem Gabrielzito é explorado em um **ambiente tridimensional**, representando o local para onde ele foi levado após a abdução.

> ⚠️ **Observação:** a definição final entre *Jogo 3D* ou *Passeio Virtual 3D* ainda está em aberto. O projeto foi estruturado para acomodar ambas as abordagens sem necessidade de grandes refatorações.

---

## Objetivos

* Aplicar conceitos fundamentais de **Computação Gráfica 3D**
* Implementar manualmente partes essenciais do **pipeline gráfico**
* Desenvolver uma cena 3D interativa com câmera em perspectiva
* Implementar **iluminação realista** utilizando o modelo de Phong
* Manter uma arquitetura de código **modular, organizada e documentada**

---

## Requisitos do Projeto (Resumo)

Os requisitos acadêmicos completos estão descritos em `docs/professor_requirements.md`.

De forma geral, o projeto contempla:

* Câmera com **projeção perspectiva** e movimentação pelo ambiente
* Iluminação baseada no **modelo de reflexão de Phong**
* Objetos 3D animados por transformações geométricas
* Uso de **texturas** e **cores sólidas**
* Renderização feita exclusivamente com **WebGL puro**
* Interação via teclado (e mouse, quando aplicável)

---

## Conceitos de Computação Gráfica Utilizados

* Pipeline gráfico 3D
* Matrizes homogêneas 4×4
* Transformações geométricas (translação, rotação e escala)
* Câmera virtual e projeção perspectiva
* Iluminação ambiente, difusa e especular (Phong)
* Texturização e mapeamento UV
* Shaders programáveis (GLSL)

---

## Organização do Repositório

```
.
├── index.html                 # Inicialização do canvas e carregamento do app
├── README.md
│
├── docs/
│   ├── professor_requirements.md   # Checklist acadêmico
│   ├── draft_implementation.md     # Planejamento técnico
│   ├── technical_draft.md          # Draft técnico WebGL (hands-on)
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
│   │   ├── glContext.js
│   │   ├── shaderUtils.js
│   │   ├── shaderProgram.js
│   │   └── objLoader.js      # Leitor próprio de OBJ (quando aplicável)
│   ├── systems/              # Sistemas independentes
│   │   ├── camera.js
│   │   ├── lighting.js
│   │   └── input.js
│   ├── geometries/           # Geometrias procedurais
│   │   └── Cube.js
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

## Metodologia de Desenvolvimento

* Desenvolvimento incremental
* Implementação progressiva dos requisitos técnicos
* Organização modular do código
* Uso de documentação complementar em `docs/`

---

## Estado do Projeto

O projeto encontra-se em fase de **definição e implementação incremental**, com foco inicial na consolidação da base gráfica (câmera, pipeline e iluminação), antes da definição final entre *Jogo 3D* ou *Passeio Virtual 3D*.

Decisões técnicas e evoluções de implementação são documentadas na pasta `docs/`.

---

## Vídeo Demonstrativo

Um vídeo demonstrando a execução do projeto será disponibilizado ao final do desenvolvimento:

* **Link:** *(placeholder – a ser adicionado)*

---

## Créditos

Projeto desenvolvido como continuação de **Gabrielzito Abduction (2D)** para a disciplina de **Computação Gráfica**.

