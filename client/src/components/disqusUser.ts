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
            border: 1px solid var(--magenta-dark);
        }
        .user {
            color: var(--link-color);
        }
        .username {
            font-weight: bolder;
        }
        .rep {
            color: var(--winamp-green);
        }
        .posts {
            color: var(--cyan-dark);
        }
        .votes {
            color: var(--peach);
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
            <div class="user">
                <span>${this.user.name}</span>
                <span class="username">(${this.user.username})</span>
            </div>
            <div>
                
                <span class="rep">${this.user.reputation} rep</span>
                ${this.user.numPosts ? html`
                    <span class="posts">${this.user.numPosts} posts</span>
                    `:html``
                }
                ${this.user.numVotes ? html`
                    <span class="votes">${this.user.numVotes} votes</span>
                    `:html``
                }
            </div>
        `
    }
}
