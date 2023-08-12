import { LitElement, css, html } from "lit"
import { customElement } from "lit/decorators.js"

@customElement('hall-view')
export class HallView extends LitElement {
    static styles = css`
        :host {
            display: flex;
            justify-content: center;
            max-width: 100%;
            width: 100%;
        }
    `

    render() {
        return html`
            <p>About</p>
        `
    }
}
