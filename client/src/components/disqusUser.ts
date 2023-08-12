import { DisqusUser } from "@common/types"
import { LitElement, css, html } from "lit"
import { customElement, property } from "lit/decorators.js"

@customElement('disqus-user')
export class DisqusUserInfo extends LitElement {
    static styles = css`
        :host {
            display: flex;
            flex-direction: column;
            padding: 0.3rem;
        }
    `

    @property({attribute: false})
    user: DisqusUser | null = null

    render() {
        if (!this.user)
            return html`
                <span>N/A</span>
            `
        return html`
            <div>
                <h3>${this.user.username}</h3>
            </div>
        `
    }
}
