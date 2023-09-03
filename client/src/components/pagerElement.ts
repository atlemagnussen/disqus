import {html, css, LitElement} from "lit"
import { customElement, property } from "lit/decorators.js"

interface PagerResult {
    totalPages: number
    pages?: number[]
}

@customElement('pager-element')
export class PagerElement extends LitElement {

    @property({attribute: true, type: Number})
    total = 0

    _pagesTotal = 0
    currentPageSize = 1000

    @property({attribute: true, type: Number})
    currentPage = 1

    _pagesArr: number[] = []
    _pageSizes = [100, 250, 500, 1000]

    static styles = css`
        :host {
            display: block;
        }
        .pagerelement {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
        }
        ul.pagination {
            list-style-type: none;
            display: flex;
            flex-direction: row;
            gap: 0.2em;
            padding-inline-start: 0;
        }
        ul.pagination li {
            cursor: pointer;
            display: inline-flex;
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: center;
            align-items: center;
            background: blue;
            padding: 0.5em;
        }
        ul.pagination li.active {
            background: red;
        }
    `


    set pagesize(value: number) {
        this.setPageSize(value)
    }
    dispatchCustomEvent(name: string, detail: any) {
        const options = { detail, bubbles: true, composed: true }
        this.dispatchEvent(new CustomEvent(name, options))
    }
    setPage(pageNum: number) {
        this.currentPage = pageNum
        this.dispatchCustomEvent("page-num-changed", pageNum)
    }
    setPageSize(pageSize: number) {
        this.currentPageSize = pageSize
        this.dispatchCustomEvent("page-size-changed", pageSize)
        this.requestUpdate()
    }
    decrement() {
        if (this.currentPage < 2)
            return
        this.setPage(this.currentPage-1)
    }
    increment() {
        if (this.currentPage >= this._pagesTotal)
            return
        this.setPage(this.currentPage+1)
    }
    updateNums() {
        const pager = this.getPager(this.currentPage, this.currentPageSize)
        if (!pager.totalPages || !pager.pages) {
            this._pagesArr = []
            this._pagesTotal = 0
            return    
        }

        this._pagesArr = pager.pages
        this._pagesTotal = pager.totalPages
        if (this.currentPage > this._pagesTotal) 
            this.setPage(1)
    }

    getPager(currentPage: number, pageSize: number) {
        currentPage = currentPage || 1
        pageSize = pageSize || 10

        let result: PagerResult = {
            totalPages: 0,
            pages: [1]
        }
        
        if (!this.total)
            return result

        let totalPages = Math.ceil(this.total / pageSize)
        let startPage = 0
        let endPage = 0

        if (totalPages <= 10) {
            startPage = 1
            endPage = totalPages
        } else {
            if (currentPage <= 6) {
                startPage = 1
                endPage = 10
            } else if (currentPage + 4 >= totalPages) {
                startPage = totalPages - 9
                endPage = totalPages
            } else {
                startPage = currentPage - 5
                endPage = currentPage + 4
            }
        }
        //const startIndex = (currentPage - 1) * pageSize
        //const endIndex = Math.min(startIndex + pageSize - 1, this.total - 1)
        const pages: number[] = []
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i)
        }
        result.pages = pages
        result.totalPages = totalPages
        return result
    }
    render() {
        this.updateNums()
        return html`
            <nav class="pagerelement">
                <ul class="pagination">
                    ${this._pagesArr.length === 0 ? 
                        html`
                            <li class='${this.currentPage === 1 ? "active" : ""}' @click="${() => this.setPage(1)}">
                                <span>1</span>
                            </li>
                        ` : 
                        html`
                            <li class='${this.currentPage === 1 ? "disabled" : ""}' @click="${() => this.setPage(1)}">
                                <span>&lt;&lt;</span>
                            </li>
                            
                            <li class='${this.currentPage === 1 ? "disabled" : ""}' @click="${() => this.decrement()}">
                                <span>&lt;</span>
                            </li>

                            ${this._pagesArr.map(page => html`
                                <li class='${this.currentPage === page ? "active" : ""}' @click="${() => this.setPage(page)}">
                                    <span>
                                        ${page}
                                    </span>
                                </li>
                            `)}
                                        
                            <li class='${this.currentPage === this._pagesTotal ? "disabled" : ""}' @click="${() => this.increment()}">
                                <span>&gt;</span>
                            </li>
                            
                            <li class='${this.currentPage === this._pagesTotal ? "disabled" : ""}' @click="${() => this.setPage(this._pagesTotal)}">
                                <span>&gt;&gt;</span>
                            </li>
                        `
                    }
                </ul>

                <ul class="pagination">
                    ${this._pageSizes.map(size => html`
                        <li class='${this.currentPageSize === size ? "active" : ""}' @click="${() => this.setPageSize(size)}">
                            <span>
                                ${size}
                            </span>
                        </li>
                    `)}
                </ul>
            </nav>
        `
    }
}
