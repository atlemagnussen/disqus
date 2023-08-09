import { LitElement, css, html } from "lit"
import { customElement, property } from "lit/decorators.js"
import { unsafeHTML } from "lit/directives/unsafe-html.js"
import { DisqusCommentItem } from "@common/types"
import dialog from "@app/components/dialogEl"


@customElement('disqus-comment')
export class DisqusComment extends LitElement {
    static styles = css`
        :host {
            display: flex;
            flex-direction: column;
            max-width: 100%;
            width: 100%;
            border: 1px solid var(--magenta-dark);
            padding: 0.3rem;
        }
        .link {
            color: var(--yellow-dark);
            cursor: pointer;
        }
        a, a:visited {
            color: var(--magenta);
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

    openForumDialog() {
        dialog.openHtml({
            title: "Forum info",
            hideOkBtn: true,
            cancelBtnText: "Close"
        }, `<forum-info forum="${this.comment.forum}" thread="${this.comment.thread}"></forum-info>`)
    }

    @property({attribute: false})
    comment: DisqusCommentItem = { message: "", forum: "", thread: "" }
    render() {
        
        return html`
            <div class="link" @click=${this.openForumDialog}>${this.comment.forum} thread id ${this.comment.thread}</div>
            <article>
                ${unsafeHTML(this.comment.message)}
            </article>
        `
    }
}
