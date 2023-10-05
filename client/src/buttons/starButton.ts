import { LitElement, css, html } from "lit"
import { customElement } from "lit/decorators.js"

@customElement('star-button')
export class StarButton extends LitElement {
    static styles = css`
        :host {
            display: inline-flex;
            justify-content: center;
            overflow: none;
            height: var(--button-height, 2rem);
            width: var(--button-width, 2rem);
            --btn-color: var(--cyan);
            color: var(--btn-color);
            cursor: pointer;
            fill: var(--grey);
        }
        svg {
            width: 100%;
            height: 100%;
        }
        
        :host(:hover) {
            fill: var(--gold-color);
        }
    `
    
    render() {
        
        return html`
            <svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 240 240">
                <path class="star" d="m48,234 73-226 73,226-192-140h238z"/>
            </svg>
        `
    }
}

