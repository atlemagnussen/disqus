import { DisqusCommentItem } from "@common/types"
import { LitElement, css, html } from "lit"
import { customElement, state } from "lit/decorators.js"
import { getPostsByAuthor } from "@common/disqusBackend"
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
    private forum = "itavisen"

    inputChangeEvent(e: any) {
        this.userName = e.target.value
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
        const res = await getPostsByAuthor(this.forum, this.userName)
        this.comments = res
    }
    
    showLink = true

    @state()
    comments: DisqusCommentItem[] = []

    render() {
        return html`
            
            <div class="wrapper">
                <div class="search">
                    <input placeholder="author username" type="text" value="RadonReady" @input=${this.inputChangeEvent} @keypress=${this.keyPressEvent} />
                    <select @change=${this.selectChangeEvent}>
                        <option value="itavisen">itavisen</option>
                        <option value="digi-no">digi</option>
                    </select>
                    <search-button @click=${this.search}></search-button>
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
        
        return html`
            <h3>Found ${this.comments.length} comments</h3>
            ${this.comments.map(c => {
                    return html`<disqus-comment .comment=${c} .showlink=${this.showLink}></disqus-comment>`
                })
            }
        `
        
    }
}
