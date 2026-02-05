# Requirements - Gabrielzito: Beyond the Abduction - Jogo 3D

## Informações Gerais

**Tipo de Projeto:** Jogo 3D - Gabrielzito: Beyond the Abduction

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
  - Implementada em `src/main.js` usando `mat4.perspective()`.
* [X] Movimentação da câmera pelo ambiente
  - Sistema de câmera configurado para primeira pessoa.
* [ ] Controle via teclado (WASD ou setas)
  - Em implementação para mecânicas de gameplay.
* [ ] Controle via mouse (opcional)
  - Planejado para controle de visão.

### Iluminação

* [ ] Implementação do **modelo de iluminação de Phong**

  * [ ] Componente ambiente
  * [ ] Componente difusa
  * [ ] Componente especular
* [ ] Pelo menos **uma fonte de luz móvel**
  - Observação: o `OBJLoader` já processa normais/UVs, mas os shaders atuais (assets/shaders/*.glsl) só aplicam `uColor` — Phong ainda não implementado.

### Pipeline Gráfico

* [X] Contexto WebGL inicializado
* [X] Shaders vertex/fragment carregados
* [X] Sistema de matrizes 4x4 (model, view, projection)
* [X] Câmera perspectiva configurada
* [X] Loop de renderização funcionando

### Carregamento de Assets

* [X] Leitor OBJ implementado (`objLoader.js`)
* [X] Sistema de carregamento de texturas
* [X] Modelos OBJ carregados (UFO, lata)
* [X] Texturas aplicadas a objetos

### Objetos e Animações

* [x] Pelo menos um objeto 3D animado por transformações geométricas
  - Rotação/transformações em `src/main.js` (`update`) e `src/core/draw.js`.
* [x] Uso de matrizes homogêneas 4×4
  - Uso de `mat4` em `src/main.js` e `src/core/draw.js`.

### Materiais

* [X] Pelo menos um objeto com **textura**
  - UFO e lata com texturas carregadas via `textureLoader.js`.
* [X] Pelo menos um objeto com **cor sólida**
  - Cubo renderizado com cor sólida.

### Interação

* [ ] Captura de eventos de teclado
* [ ] Captura de eventos de mouse (se aplicável)

---

## Requisitos Específicos – Jogo 3D

**Conceito do Jogo:** Gabrielzito está preso na nave alienígena e precisa coletar itens espalhados pelo ambiente 3D enquanto evita ser detectado pelas câmeras de vigilância dos aliens.

### Mecânicas de Gameplay

* [ ] **Sistema de Coleta de Itens**
  - [ ] Itens espalhados em diferentes coordenadas (x, y, z)
  - [ ] Detecção de proximidade (raio ~2 unidades)
  - [ ] Coleta via tecla SPACE quando próximo
  - [ ] Remoção do item da cena após coleta
  - [ ] Feedback visual/sonoro ao coletar
  - [ ] HUD com contador de itens (X/Y coletados)
* [ ] **Sistema de Câmeras Alienígenas**
  - [ ] Câmeras de vigilância posicionadas no cenário
  - [ ] Modelo 3D visível (câmera de segurança)
  - [ ] Animação de rotação/varredura
  - [ ] Cone de visão visualizado
  - [ ] Sistema de line-of-sight para detecção
  - [ ] Tempo de detecção (~2 segundos)
  - [ ] Indicador visual de alerta
  - [ ] Consequências ao ser detectado
* [ ] **Movimentação do Jogador**
  - [ ] Controle via teclado (WASD)
  - [ ] Movimentação em primeira pessoa
  - [ ] Navegação livre pelo ambiente 3D
  - [ ] Atualização de câmera com posição do jogador
  - [ ] Física básica aplicada
  - [ ] Possível detecção de colisões básicas
* [ ] **HUD e Interface**
  - [ ] Contador de itens na tela
  - [ ] Indicador de detecção
  - [ ] Menu inicial ("Iniciar Jogo", "Controles")
  - [ ] Tela de pause
  - [ ] Tela de vitória
  - [ ] Tela de game over
* [ ] **Lógica de Vitória/Derrota**
  - [ ] Condição de vitória (todos itens + zona de escape)
  - [ ] Condição de derrota (detectado por câmeras)

### Requisitos Técnicos

* [X] Câmera livre (primeira ou terceira pessoa)
  - Câmera em primeira pessoa implementada.
* [ ] Movimentação do jogador pelo ambiente
  - Sistema de input em desenvolvimento.
* [X] Uso de objetos 3D carregados de arquivos OBJ
  - UFO e lata carregados via `objLoader.js`.
* [X] Implementação **obrigatória** de leitor próprio de OBJ
  - Implementado em `src/core/objLoader.js`.
* [X] Permitido utilizar modelos 3D gratuitos disponíveis na internet
  - Modelos baixados e armazenados em `assets/models/`.

---

## Assets Necessários

### Modelos 3D (OBJ)
- [X] UFO (já presente)
- [X] Lata amassada (já presente)
- [ ] Câmera de vigilância
- [ ] Itens coletáveis (cristais, dispositivos)
- [ ] Estruturas da nave (paredes, chão, teto)
- [ ] Porta/portal de escape
- [ ] Objetos decorativos (painéis, caixas)

### Texturas
- [X] Textura do UFO
- [X] Textura da lata
- [ ] Textura metálica (paredes)
- [ ] Textura de painéis alien
- [ ] Textura de itens coletáveis

### Áudio (Opcional)
- [ ] Som ambiente da nave
- [ ] Som de coleta de item
- [ ] Som de alerta de câmera
- [ ] Som de footsteps
- [ ] Música de fundo

---

## Critérios de Avaliação

* **40%** – Funcionalidades técnicas
* **25%** – Criatividade, complexidade da cena e design visual
* **10%** – Organização do código e documentação
* **25%** – Apresentação em sala

---

## Itens Obrigatórios para Entrega

**Data Limite:** 09/02 até 07h00

* [X] Repositório público no GitHub
  - Repositório configurado e versionado.
* [X] README do projeto
  - Documentação completa em `README.md`.
* [X] Tutorial de compilação e execução
  - Instruções de execução via servidor HTTP local.
* [ ] Link para slides da apresentação
  - A ser criado antes da apresentação.
* [ ] Link para vídeo demonstrativo
  - A ser gravado demonstrando gameplay e funcionalidades.

