/**
 * mainMenu.js
 * Menu principal do jogo — navegação por Arrow Keys + Enter
 * Sub-telas: Lore (história) e Tutorial (comandos)
 * ESC durante gameplay volta ao menu via callback onPause
 */

// ─── Conteúdo das sub-telas ────────────────────────────────

const LORE_HTML = `
    <div class="menu-textbox">
        <div class="menu-textbox-title">Fuga de Gabrielzito?</div>
        <div class="menu-textbox-body">
            <p><strong>Gabrielzito</strong> vivia sua vida tranquila na Bahia até que os
            homenzinhos verdes o capturaram.</p>
            <p>Preso a bordo de uma nave alienígena, ele agora tenta encontrar uma forma
            de escapar dos corredores frios e das salas de controle antes que seja tarde.</p>
            <p>Você deve ajudá-lo a explorar, encontrar pistas e abrir uma rota de fuga.</p>
        </div>
        <div class="menu-textbox-back">Pressione <span>ESC</span> ou <span>ENTER</span> para voltar</div>
    </div>
`;

const TUTORIAL_HTML = `
    <div class="menu-textbox">
        <div class="menu-textbox-title">⌁ Controles ⌁</div>
        <div class="menu-textbox-body">
            <table>
                <tr>
                    <td><span class="key">W</span><span class="key">A</span><span class="key">S</span><span class="key">D</span></td>
                    <td>Movimentação (frente, esquerda, trás, direita)</td>
                </tr>
                <tr>
                    <td><span class="key">Mouse</span></td>
                    <td>Controlar direção do olhar</td>
                </tr>
                <tr>
                    <td><span class="key">SPACE</span></td>
                    <td>Pular / Pressionar botão na Escape Room</td>
                </tr>
                <tr>
                    <td><span class="key">B</span></td>
                    <td>Modo Building (voar/atravessar paredes para debug)</td>
                </tr>
                <tr>
                    <td><span class="key">ESC</span></td>
                    <td>Abrir menu de pausa</td>
                </tr>
            </table>
        </div>
        <div class="menu-textbox-back">Pressione <span>ESC</span> ou <span>ENTER</span> para voltar</div>
    </div>
`;

// ─── Opções do menu ────────────────────────────────────────

const OPTIONS = [
    { label: 'Jogar',     action: 'play'     },
    { label: 'Lore',      action: 'lore'     },
    { label: 'Controles', action: 'tutorial' },
];

// ─── Classe MainMenu ───────────────────────────────────────

export class MainMenu {
    /**
     * @param {HTMLElement} container  - Elemento #menu-overlay
     * @param {Object}      callbacks - { onPlay: Function }
     */
    constructor(container, callbacks = {}) {
        this.container = container;
        this.onPlay = callbacks.onPlay || (() => {});

        this.activeIndex = 0;          // Opção selecionada
        this.state = 'main';           // 'main' | 'lore' | 'tutorial'
        this.isPlaying = false;        // true quando gameplay está ativa

        // Bound handlers (para poder remover depois)
        this._onKeyDown = this._handleKeyDown.bind(this);
        this._onEscDuringGame = this._handleEscDuringGame.bind(this);
    }

    // ── API pública ─────────────────────────────────

    show() {
        this.state = 'main';
        this.activeIndex = 0;
        this.isPlaying = false;
        this._renderMain();
        this.container.classList.remove('hidden');
        window.addEventListener('keydown', this._onKeyDown);
        window.removeEventListener('keydown', this._onEscDuringGame);
    }

    hide() {
        this.container.classList.add('hidden');
        this.container.innerHTML = '';
        this.isPlaying = true;
        window.removeEventListener('keydown', this._onKeyDown);
        window.addEventListener('keydown', this._onEscDuringGame);
    }

    // ── Renderização ─────────────────────────────────

    /** Tela principal com lista de opções */
    _renderMain() {
        const optionsHTML = OPTIONS.map((opt, i) => {
            const cls = i === this.activeIndex ? 'menu-option active' : 'menu-option';
            return `<li class="${cls}" data-index="${i}">${opt.label}</li>`;
        }).join('');

        this.container.innerHTML = `
            <div class="menu-ufo-icon">&#x1F6F8;</div>
            <div class="menu-title">Gabrielzito: Beyond the Abduction</div>
            <div class="menu-subtitle">os homenzinhos verdes me pegaram</div>
            <ul class="menu-options">${optionsHTML}</ul>
            <div class="menu-hint">↑ ↓ navegar  ·  ENTER selecionar  ·  ESC voltar ao menu durante o jogo</div>
        `;
    }

    /** Sub-tela genérica (lore ou tutorial) */
    _renderSubScreen(html) {
        this.container.innerHTML = html;
    }

    /** Atualiza apenas as classes CSS das opções (sem re-render completo) */
    _refreshActiveOption() {
        const items = this.container.querySelectorAll('.menu-option');
        items.forEach((el, i) => {
            el.classList.toggle('active', i === this.activeIndex);
        });
    }

    // ── Input ────────────────────────────────────────

    _handleKeyDown(e) {
        // Previne scroll da página com setas
        if (['ArrowUp', 'ArrowDown', 'Enter', 'Escape'].includes(e.code)) {
            e.preventDefault();
        }

        if (this.state === 'main') {
            this._handleMainInput(e);
        } else {
            // Sub-tela (lore / tutorial): qualquer ESC ou Enter volta
            this._handleSubScreenInput(e);
        }
    }

    /** ESC pressionado durante a gameplay → volta ao menu */
    _handleEscDuringGame(e) {
        if (e.code === 'Escape' && this.isPlaying) {
            e.preventDefault();
            // Callback registrado por main.js para pausar o loop
            if (this.onPause) this.onPause();
            this.show();
        }
    }

    _handleMainInput(e) {
        switch (e.code) {
            case 'ArrowUp':
                this.activeIndex = (this.activeIndex - 1 + OPTIONS.length) % OPTIONS.length;
                this._refreshActiveOption();
                break;

            case 'ArrowDown':
                this.activeIndex = (this.activeIndex + 1) % OPTIONS.length;
                this._refreshActiveOption();
                break;

            case 'Enter':
                this._executeOption(OPTIONS[this.activeIndex].action);
                break;
        }
    }

    _handleSubScreenInput(e) {
        if (e.code === 'Escape' || e.code === 'Enter') {
            this.state = 'main';
            this._renderMain();
        }
    }

    // ── Ações ────────────────────────────────────────

    _executeOption(action) {
        switch (action) {
            case 'play':
                this.hide();
                this.onPlay();
                break;

            case 'lore':
                this.state = 'lore';
                this._renderSubScreen(LORE_HTML);
                break;

            case 'tutorial':
                this.state = 'tutorial';
                this._renderSubScreen(TUTORIAL_HTML);
                break;
        }
    }
}
