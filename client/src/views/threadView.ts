import { getPostsByThread } from "@common/disqusBackend"
import { PaginatedComments } from "@common/types"
import { LitElement, TemplateResult, css, html } from "lit"
import { customElement, property, state } from "lit/decorators.js"
import {classMap} from "lit/directives/class-map.js"
import { scrollToTop } from "@app/services/helpers"

interface IClasses extends Record<string, boolean> {}

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
        .level1 {
            margin-left: 1rem;
        }
        .level2 {
            margin-left: 2rem;
        }
    `

    @property({ attribute: true})
    forum = ""

    @property({ attribute: true})
    thread = ""

    @state()
    comments: PaginatedComments | null = null

    pagesize = 1000
    async getComments() {
        const res = await getPostsByThread(this.forum, this.thread, 1, this.pagesize)
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
                    <span>Number of comments in this db: ${this.comments?.data.length}</span>
                </div>
                <div class="result">
                    ${this.renderContent()}
                </div>
                
            </div>
        `
    }
    renderContent() {
        if (this.comments?.data.length == 0)
            return html`<h2>No entries</h2>`
        
        const rootComments = this.comments?.data.filter(c => c.parent == null)
        if (!rootComments || rootComments.length == 0)
            return html`<h2>No root comments</h2>`

        let level = 0
        const classes: IClasses = { "level0": true }
        return rootComments.map(c => {
            return html`
                <disqus-comment class=${classMap(classes)} .comment=${c}></disqus-comment>
                ${this.renderThread(c.id, level)}
            `
        })
    }
    renderThread(id: number, level: number): TemplateResult<1> | TemplateResult<1>[] {
        const comments = this.comments?.data.filter(c => c.parent == id)
        if (!comments || comments.length == 0)
            return html``

        const classes: IClasses = {}
        classes[`level${level+1}`] = true
        
        return comments.map(c => {
            return html`
                <disqus-comment class=${classMap(classes)} .comment=${c}></disqus-comment>
                ${this.renderThread(c.id, level+1)}
            `
        })
    }
}
