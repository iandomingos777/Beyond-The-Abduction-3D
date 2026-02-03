# Professor Requirements 

## Informações Gerais

* **Tecnologias Permitidas:**

  * OpenGL ≥ 4.0 **ou** WebGL puro
  * ❌ Proibido uso de bibliotecas gráficas de alto nível (ex.: three.js)

---

## Requisitos Gerais (Obrigatórios)

### Renderização

- [x] Cena desenhada exclusivamente com OpenGL (≥ 4.0) ou WebGL puro
  - Implementado com WebGL via `src/core/glContext.js` e `src/main.js`.
- [x] Nenhuma função gráfica de alto nível utilizada
  - Não foram encontradas bibliotecas como `three.js` no repositório.
- [x] Contexto gráfico apenas para inicialização (Canvas, SDL, PyGame, GTK)
  - Contexto obtido a partir do `canvas` em `src/core/glContext.js`.

### Câmera e Projeção

* [X] Câmera com **projeção perspectiva**
* [ ] Movimentação da câmera pelo ambiente
* [ ] Controle via teclado (WASD ou setas)
* [ ] Controle via mouse (opcional)

### Iluminação

* [ ] Implementação do **modelo de iluminação de Phong**

  * [ ] Componente ambiente
  * [ ] Componente difusa
  * [ ] Componente especular
* [ ] Pelo menos **uma fonte de luz móvel**
  - Observação: o `OBJLoader` já processa normais/UVs, mas os shaders atuais (assets/shaders/*.glsl) só aplicam `uColor` — Phong ainda não implementado.

### Objetos e Animações

* [x] Pelo menos um objeto 3D animado por transformações geométricas
  - Rotação/transformações em `src/main.js` (`update`) e `src/core/draw.js`.
* [x] Uso de matrizes homogêneas 4×4
  - Uso de `mat4` em `src/main.js` e `src/core/draw.js`.

### Materiais

* [ ] Pelo menos um objeto com **textura**
* [X] Pelo menos um objeto com **cor sólida**

### Interação

* [ ] Captura de eventos de teclado
* [ ] Captura de eventos de mouse (se aplicável)

---

## Requisitos Específicos – Passeio Virtual 3D

*(Aplicável apenas se o projeto for definido como passeio virtual)*

* [ ] Câmera em primeira pessoa
* [ ] Controle da câmera via teclado (WASD ou setas)
* [ ] Detecção de colisão realista **não obrigatória**
* [ ] Cenário construído manualmente no código
* [ ] ❌ Importação de modelos externos não permitida

### Opcional

* [ ] Implementar leitor próprio de arquivos OBJ
* [ ] Caso implementado, passa a ser permitido utilizar modelos criados no Blender

---

## Requisitos Específicos – Jogo 3D

*(Aplicável apenas se o projeto for definido como jogo 3D)*

* [ ] Câmera livre (primeira ou terceira pessoa)
* [ ] Movimentação do jogador pelo ambiente
* [ ] Uso de objetos 3D carregados de arquivos OBJ
* [ ] Implementação **obrigatória** de leitor próprio de OBJ
* [ ] Permitido utilizar modelos 3D gratuitos disponíveis na internet

---

## Critérios de Avaliação

* **40%** – Funcionalidades técnicas
* **25%** – Criatividade, complexidade da cena e design visual
* **10%** – Organização do código e documentação
* **25%** – Apresentação em sala

---

## Itens Obrigatórios para Entrega

* [ ] Repositório público no GitHub
* [X] README do projeto
* [X] Tutorial de compilação e execução
* [ ] Link para slides da apresentação
* [ ] Link para vídeo demonstrativo
  - Código presente em `src/` e assets; execução via servidor local (ex.: `python3 -m http.server`).
* [x] README do projeto

