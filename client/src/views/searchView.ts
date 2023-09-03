import { PaginatedComments } from "@common/types"
import { LitElement, css, html } from "lit"
import { customElement, state } from "lit/decorators.js"
import { searchPosts } from "@common/disqusBackend"
import { scrollToTop } from "@app/services/helpers"

@customElement('search-view')
export class SearchView extends LitElement {
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
        .error {
            color: var(--cardinal-blue);
        }
        * {
            box-sizing: border-box;
        }
        search-button {
            --button-height: 2rem;
            --button-width: 2rem;
        }
    `

    connectedCallback(): void {
        super.connectedCallback()
        scrollToTop()
    }

    private userName = "RadonReady"
    private authorName = ""
    private content = ""
    private forum = "itavisen"
    
    @state()
    searching = false

    usernameChanged(e: any) {
        this.userName = e.target.value
    }
    authorNameChanged(e: any) {
        this.authorName = e.target.value
    }
    contentChanged(e: any) {
        this.content = e.target.value
    }
    selectChangeEvent(e: any) {
        this.forum = e.target.value
    }
    keyPressEvent(e: any) {
        if (e.key === "Enter") {
            e.preventDefault()
            this.search()
        }
    }
    async search() {
        this.error = ""
        this.searching = true
        try {
            const res = await searchPosts(this.forum, this.page, this.pagesize, this.userName, this.authorName, this.content)
            this.comments = res
        }
        catch(error: any) {
            this.error = error.message
            this.comments = null
        }
        finally {
            this.searching = false
        }
    }

    page = 1
    pageNumChanged(e: CustomEvent) {
        this.page = e.detail as number
        this.search()
    }
    pagesize = 1000
    pageSizeChanged(e: CustomEvent) {
        this.pagesize = e.detail as number
        this.search()
    }

    private error = ""
    
    showLink = true

    @state()
    comments: PaginatedComments | null = null

    render() {
        return html`
            
            <div class="wrapper">
                <div class="search">
                    <input placeholder="author username" type="text" value="RadonReady" @input=${this.usernameChanged} @keypress=${this.keyPressEvent} />
                    <input placeholder="author name" type="text" value="" @input=${this.authorNameChanged} @keypress=${this.keyPressEvent} />
                    <input placeholder="content" type="text" value="" @input=${this.contentChanged} @keypress=${this.keyPressEvent} />
                    <forum-selector @change=${this.selectChangeEvent}></forum-selector>
                    <search-button @click=${this.search}></search-button>
                    ${this.error ? html`
                        <span class="error">${this.error}</span>
                    ` : html``}
                </div>
                <div class="result">
                    ${this.renderContent()}
                </div>
                
            </div>
        `
    }
    renderComments() {
        return this.comments?.data.map(c => html`<disqus-comment .comment=${c} .showlink=${this.showLink}></disqus-comment>`)
            
    }
    renderContent() {
        
        if (!this.comments || this.comments.pagination.totalCount == 0)
            return html`<h2>No entries, try to perform a search!</h2>`
        
        return html`
            <h3>Found ${this.comments.pagination.totalCount}, showing ${this.comments?.data.length} comments from page ${this.comments.pagination.page}</h3>
            <pager-element 
                total=${this.comments?.pagination.totalCount!}
                currentpage=${this.page}
                @page-num-changed=${this.pageNumChanged}
                @page-size-changed=${this.pageSizeChanged}>
            </pager-element>

            ${this.searching ? 
                html`<h2>Searching...</h2>` : 
                this.renderComments()
            }
        `
        
    }
}
