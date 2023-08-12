import { DisqusUser } from "@common/types"
import { LitElement, css, html } from "lit"
import { customElement, property } from "lit/decorators.js"

@customElement('disqus-user-list')
export class DisqusUserList extends LitElement {
    static styles = css`
        :host {
            display: flex;
            flex-direction: column;
            padding: 0.3rem;
        }
    `

    @property({attribute: false})
    users: DisqusUser[] = []

    render() {
        
        return html`
            <article>
                ${this.users.map(u => {
                    return html`<disqus-user .user=${u}></disqus-user>`
                })}
            </article>
        `
    }
}
