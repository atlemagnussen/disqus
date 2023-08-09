import { LitElement, css, html } from "lit"
import { customElement } from "lit/decorators.js"

import "./views/commentsView"
import "./components"
import "./buttons"
import "./vars.css"
import "./index.css"

@customElement('disqus-app')
export class DisqusApp extends LitElement {
    static styles = css`
        :host {
            overflow: hidden;
            height: 100%;
            display: grid;
            grid-template-columns: 1fr;
            grid-template-rows: auto 1fr auto;
            grid-template-areas:
                'header'
                'main'
                'footer';
        }
        * {
            box-sizing: border-box;
        }
        header {
            background: var(--secondary-background);
            grid-area: header;
            padding: 0.2rem;
            display: block;
            overflow: hidden;
        }

        main {
            overflow-x: hidden;
            overflow-y: auto;
            grid-area: main;
            padding: 0.5rem;
            display: block;
        }

        footer {
            grid-area: footer;
            max-width: 100vw;
            background: var(--secondary-background);
            padding: 0.2rem;
        }
        main::-webkit-scrollbar {
            width: 1em;
        }

        main::-webkit-scrollbar-track {
            box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
        }

        main::-webkit-scrollbar-thumb {
            background-color: var(--magenta-dark);
            outline: 1px solid slategrey;
        }
    `

    render() {
        return html`
            <header>
                <disqus-header></disqus-header>
            </header>

            <main>
                <comments-view></comments-view
            </main>


            <footer>
                <span></span>
            </footer>

        `
  }
}
