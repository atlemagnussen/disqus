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
        .userinfo {
            color: var(--cyan);
        }
        .likes {
            color: var(--winamp-green);
        }
        .downvotes {
            color: var(--cardinal);
        }
        datetime-viewer {
            font-weight: bolder;
            color: var(--cyan-dark);
        }
        small {
            color: var(--peach-dark);
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
    comment: DisqusCommentItem = { id: 0, parent: null, message: "", forum: "", thread: "", likes: 0, dislikes: 0 }

    @property({attribute: false})
    showlink = false

    render() {
        
        return html`
            ${this.showlink ? 
                html`
                    <div class="link">
                        <a href="/thread/${this.comment.forum}/${this.comment.thread}">
                            Open thread ${this.comment.thread}
                        </a>
                    </div>
                `
                :
                html``
            }
            <div class="userinfo">
                <datetime-viewer date="${this.comment.createdAt!}"></datetime-viewer>
                <span>${this.comment.author?.name} (${this.comment.author?.username}) id: ${this.comment.author?.id}</span>
                <span class="likes">Likes: ${this.comment.likes}</span>
                <span class="downvotes">Downvotes: ${this.comment.dislikes}</span>
                ${this.comment.isApproved ? html`<small>approved</small>` : html``}
                ${this.comment.isSpam ? html`<small>spam</small>` : html``}
                ${this.comment.isDeleted ? html`<small>deleted</small>` : html``}
                ${this.comment.isDeletedByAuthor ? html`<small>deleted by author</small>` : html``}
                ${this.comment.isFlagged ? html`<small>flagged</small>` : html``}
                
            </div>
            <article>
                ${unsafeHTML(this.comment.message)}
            </article>
        `
    }
}
