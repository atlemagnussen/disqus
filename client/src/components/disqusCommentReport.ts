import { LitElement, css, html } from "lit"
import { customElement, property } from "lit/decorators.js"
import { unsafeHTML } from "lit/directives/unsafe-html.js"
import { DisqusCommentItem } from "@common/types"


@customElement('disqus-comment-report')
export class DisqusCommentReport extends LitElement {
    static styles = css`
        :host {
            display: flex;
            flex-direction: column;
            max-width: 100%;
            width: 100%;
            border: 1px solid var(--magenta-dark);
            padding: 0.3rem;
        }
        
        datetime-viewer {
            font-weight: bolder;
            color: var(--cyan-dark);
        }
        
        @media only screen and (max-width: 640px) {
            .wrapper {
                width: 100%;
                max-width: 100%;
            }
            h1 {
                font-size: 1.1rem;
            }
        }
    `

    @property({attribute: false})
    comment: DisqusCommentItem = { id: 0, parent: null, message: "", forum: "", thread: "", likes: 0, dislikes: 0 }


    render() {
        return html`
            <div class="userinfo">
                <datetime-viewer date="${this.comment.createdAt!}"></datetime-viewer>
                <span>${this.comment.author?.name}</span>
            </div>
            <article>
                ${unsafeHTML(this.comment.message)}
            </article>
            <forum-link forum="${this.comment.forum}" thread="${this.comment.thread}"></forum-link>
        `
    }
}
