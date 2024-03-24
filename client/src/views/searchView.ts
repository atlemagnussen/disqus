import { PaginatedComments, SearchRequest } from "@common/types"
import { LitElement, css, html } from "lit"
import { customElement, state } from "lit/decorators.js"
import { searchPostsBase } from "@common/disqusBackend"
import { scrollToTop } from "@app/services/helpers"
import { saveSearchRequest } from "@app/storage/database"
import { SavedSearchRequest } from "@common/models"
import { forums } from "@app/services/config"

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
    
    @state()
    searching = false

    searchRequest: SearchRequest = {
        forum: forums[0],
        username: "",
        authorname: "",
        userid: "",
        text: "",
        pagination: {
            page: 1,
            pageSize: 1000
        }
    }
    usernameChanged(e: any) {
        this.searchRequest.username = e.target.value
    }
    authorNameChanged(e: any) {
        this.searchRequest.authorname = e.target.value
    }
    authorIdChanged(e: any) {
        this.searchRequest.userid = e.target.value
    }
    contentChanged(e: any) {
        this.searchRequest.text = e.target.value
    }
    selectChangeEvent(e: any) {
        this.searchRequest.forum = e.target.value
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
        if (this.comments)
            this.comments.data = []
        try {
            const res = await searchPostsBase(this.searchRequest)
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

    pageNumChanged(e: CustomEvent) {
        if (this.searchRequest.pagination) {
            this.searchRequest.pagination.page = e.detail as number
            this.search()
        }
    }
    
    pageSizeChanged(e: CustomEvent) {
        if (this.searchRequest.pagination) {
            this.searchRequest.pagination.pageSize = e.detail as number
            this.search()
        }
    }

    saveFavorite() {
        const nameOfFav = prompt("Please enter a name for this favorite search")
        if (!nameOfFav) {
            alert("need a string!")
            return
        }
        saveSearchRequest(nameOfFav, this.searchRequest)
    }

    selectedFavorite(e: CustomEvent) {
        const req = e.detail as SavedSearchRequest | null
        if (req) {
            this.searchRequest = req
            this.search()
        }
    }

    @state()
    showReport = false

    showReportChangeEvent(e: any) {
        this.showReport = e.target.checked
    }
    private error = ""
    
    showLink = true

    @state()
    comments: PaginatedComments | null = null

    render() {
        return html`
            
            <div class="wrapper">
                <div class="search">
                    <input placeholder="author username" type="text" .value=${this.searchRequest.username ?? ""} @input=${this.usernameChanged} @keypress=${this.keyPressEvent} />
                    <input placeholder="author name" type="text" .value=${this.searchRequest.authorname ?? ""} @input=${this.authorNameChanged} @keypress=${this.keyPressEvent} />
                    <input placeholder="author ID" type="text" .value=${this.searchRequest.userid ?? ""} @input=${this.authorIdChanged} @keypress=${this.keyPressEvent} />
                    <input placeholder="content" type="text" value="" @input=${this.contentChanged} @keypress=${this.keyPressEvent} />
                    <forum-selector @change=${this.selectChangeEvent}></forum-selector>
                    <search-button @click=${this.search}></search-button>
                    <favorite-searches
                        @starclicked=${this.saveFavorite} 
                        @selectedfavorite=${this.selectedFavorite}>
                    </favorite-searches>
                </div>
                <div>
                    <label for="showreport">Copy paste mode</label>
                    <input type="checkbox" id="showreport" .checked=${this.showReport} @change=${this.showReportChangeEvent}>
                </div>
                <div class="result">
                    ${this.error ? html`
                        <span class="error">${this.error}</span>
                    ` :
                        this.renderContent()
                    }
                    
                </div>
                
            </div>
        `
    }
    renderComments() {
        if (this.showReport)
            return this.comments?.data.map(c => html`<disqus-comment-report .comment=${c}></disqus-comment-report>`)
        
        return this.comments?.data.map(c => html`<disqus-comment .comment=${c} .showlink=${this.showLink}></disqus-comment>`)    
    }
    renderContent() {
        
        if ((!this.comments || this.comments.data.length === 0) && !this.searching)
            return html`<h2>No entries, try to perform a search!</h2>`
        
        return html`
            <h3>Found ${this.comments?.pagination.totalCount}, showing ${this.comments?.data.length} comments from page ${this.comments?.pagination.page}</h3>
            <pager-element 
                total=${this.comments?.pagination.totalCount!}
                currentpage=${this.searchRequest.pagination?.page!}
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
