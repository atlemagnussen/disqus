import { getPostsByThread } from "@common/disqusBackend"
import { DisqusCommentItem } from "@common/types"
import { LitElement, css, html } from "lit"
import { customElement, property, state } from "lit/decorators.js"

import { scrollToTop } from "@app/services/helpers"

@customElement('thread-view')
export class ThreadView extends LitElement {
    static styles = css`
        :host {
            display: flex;
            justify-content: center;
            max-width: 100%;
            width: 100%;
        }
        .wrapper {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            width: var(--default-width);
            max-width: var(--default-width);
        }
        .result {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }
    `

    @property({ attribute: true})
    forum = ""

    @property({ attribute: true})
    thread = ""

    @state()
    comments: DisqusCommentItem[] = []

    async getComments() {
        const res = await getPostsByThread(this.forum, this.thread)
        this.comments = res
    }
    connectedCallback(): void {
        super.connectedCallback()
        scrollToTop()
        if (this.thread)
            this.getComments()
    }

    render() {
        return html`
            
            <div class="wrapper">
                <div class="info">
                    <forum-info forum="${this.forum}" thread="${this.thread}"></forum-info>
                    <span>Number of comments in this db: ${this.comments.length}</span>
                </div>
                <div class="result">
                    ${this.renderContent()}
                </div>
                
            </div>
        `
    }
    renderContent() {
        if (this.comments.length == 0)
            return html`<h2>No entries</h2>`
        
        return this.comments.map(c => {
            return html`<disqus-comment .comment=${c}></disqus-comment>`
        })
    }
}
