/**
 * mainMenu.js
 * Menu principal do jogo — navegação por Arrow Keys + Enter
 * Sub-telas: Lore (história) e Tutorial (comandos)
 *
 * Uso:
 *   const menu = new MainMenu(containerEl, { onPlay: () => {...} });
 *   menu.show();          // exibe o menu
 *   menu.hide();          // esconde (chamado internamente ao clicar "Jogar")
 */

// ─── Conteúdo das sub-telas ────────────────────────────────

const LORE_HTML = `
    <div class="menu-textbox">
        <div class="menu-textbox-title">Lore</div>
        <div class="menu-textbox-body">
            <p>No universo do jogo 2D, <strong>Gabrielzito</strong> vivia sua vida
            pacata até ser capturado por forças alienígenas misteriosas.</p>
            <p>Agora preso em uma nave espacial à deriva no espaço profundo,
            ele precisa explorar os corredores sombrios da estação,
            encontrar pistas sobre o que aconteceu e descobrir uma rota de fuga
            antes que seja tarde demais.</p>
            <p>A nave parece abandonada… mas algo ainda se move entre as paredes.</p>
        </div>
        <div class="menu-textbox-back">Pressione <span>ESC</span> ou <span>ENTER</span> para voltar</div>
    </div>
`;

const TUTORIAL_HTML = `
    <div class="menu-textbox">
        <div class="menu-textbox-title">Tutorial</div>
        <div class="menu-textbox-body">
            <table>
                <tr>
                    <td><span class="key">W</span><span class="key">A</span><span class="key">S</span><span class="key">D</span></td>
                    <td>Movimentação (frente, esquerda, trás, direita)</td>
                </tr>
                <tr>
                    <td><span class="key">Mouse</span></td>
                    <td>Olhar ao redor (rotação da câmera)</td>
                </tr>
                <tr>
                    <td><span class="key">Q</span> / <span class="key">E</span></td>
                    <td>Descer / Subir</td>
                </tr>
                <tr>
                    <td><span class="key">Clique</span></td>
                    <td>Capturar o cursor (ativa controle de câmera)</td>
                </tr>
                <tr>
                    <td><span class="key">ESC</span></td>
                    <td>Liberar o cursor</td>
                </tr>
            </table>
        </div>
        <div class="menu-textbox-back">Pressione <span>ESC</span> ou <span>ENTER</span> para voltar</div>
    </div>
`;

// ─── Opções do menu ────────────────────────────────────────

const OPTIONS = [
    { label: 'Jogar',    action: 'play'     },
    { label: 'Lore',     action: 'lore'     },
    { label: 'Tutorial', action: 'tutorial' },
    { label: 'Sair',     action: 'quit'     },
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

        // Bound handler (para poder remover depois)
        this._onKeyDown = this._handleKeyDown.bind(this);
    }

    // ── API pública ─────────────────────────────────

    show() {
        this.state = 'main';
        this.activeIndex = 0;
        this._renderMain();
        this.container.classList.remove('hidden');
        window.addEventListener('keydown', this._onKeyDown);
    }

    hide() {
        this.container.classList.add('hidden');
        this.container.innerHTML = '';
        window.removeEventListener('keydown', this._onKeyDown);
    }

    // ── Renderização ─────────────────────────────────

    /** Tela principal com lista de opções */
    _renderMain() {
        const optionsHTML = OPTIONS.map((opt, i) => {
            const cls = i === this.activeIndex ? 'menu-option active' : 'menu-option';
            return `<li class="${cls}" data-index="${i}">${opt.label}</li>`;
        }).join('');

        this.container.innerHTML = `
            <div class="menu-title">Nave Perdida</div>
            <div class="menu-subtitle">Uma aventura no espaço</div>
            <ul class="menu-options">${optionsHTML}</ul>
            <div class="menu-hint">↑ ↓ para navegar  ·  ENTER para selecionar</div>
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

            case 'quit':
                // window.close() só funciona se a aba foi aberta via JS
                window.close();
                // Fallback caso o browser bloqueie
                window.location.href = 'about:blank';
                break;
        }
    }
}
