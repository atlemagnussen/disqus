import { LitElement, css, html } from "lit"
import { customElement } from "lit/decorators.js"

@customElement('comments-view')
export class CommentsView extends LitElement {
    static styles = css`
        :host {
            display: flex;
            justify-content: center;
            max-width: 100%;
            width: 100%;
        }
        .wrapper {
            display: block;
            width: var(--default-width);
            max-width: var(--default-width);
        }
        * {
            box-sizing: border-box;
        }
    `
    
    render() {
        return html`
            <div class="wrapper">
                ${this.renderContent()}
            </div>
        `
    }
    renderContent() {
        return html`<h2>No entries</h2>`
    }
}
