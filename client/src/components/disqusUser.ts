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
        .username {
            font-weight: bolder;
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
                <span class="username">${this.user.username}</span>
                <span class="posts">${this.user.numPosts}</span>
            </div>
        `
    }
}
