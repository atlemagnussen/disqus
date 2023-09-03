import {html, css, LitElement} from "lit"
import { customElement, property } from "lit/decorators.js"

@customElement('pager-element')
export class PagerElement extends LitElement {

    @property({attribute: true, type: Number})
    total = 0

    _pagesTotal = 0
    _currentPageSize = 10
    _currentPage = 1
    _pagesArr: number[] = []
    _pageSizes = [10, 25, 50, 100]

    styles() {
        return css`
            div.pagerelement {
                display: flex;
                flex-direction: row;
                justify-content: space-between;
            }
            div.pagerelement .pagination {
                margin: 20px 0 0 0;
            }
        `
    }


    set pagesize(value: number) {
        this.setPageSize(value)
    }
    dispatchCustomEvent(name: string, detail: any) {
        const options = { detail, bubbles: true, composed: true }
        this.dispatchEvent(new CustomEvent(name, options))
    }
    setPage(pageNum: number) {
        this._currentPage = pageNum
        this.dispatchCustomEvent("pagenumchanged", {pageNum})
        this.requestUpdate()
    }
    setPageSize(pageSize: number) {
        this._currentPageSize = pageSize
        this.dispatchCustomEvent("pagesizechanged", {pageSize})
        this.requestUpdate()
    }
    decrement() {
        if (this._currentPage < 2)
            return
        this.setPage(this._currentPage-1)
    }
    increment() {
        if (this._currentPage >= this._pagesTotal)
            return
        this.setPage(this._currentPage+1)
    }
    updateNums() {
        const pager = this.getPager(this.total, this._currentPage, this._currentPageSize)
        this._pagesArr = pager.pages
        this._pagesTotal = pager.totalPages
        if (this._currentPage > this._pagesTotal) 
            this.setPage(1)
    }
    getPager(totalItems: number, currentPage: number, pageSize: number) {
        currentPage = currentPage || 1
        pageSize = pageSize || 10
        const totalPages = Math.ceil(totalItems / pageSize)
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
        const startIndex = (currentPage - 1) * pageSize
        const endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1)
        const pages: number[] = []
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i)
        }

        return {
            totalItems,
            currentPage,
            pageSize,
            totalPages,
            startPage,
            endPage,
            startIndex,
            endIndex,
            pages
        }
    }
    render() {
        this.updateNums()
        return html`
        <style>${this.styles()}</style>
        <div class="pagerelement">
            <ul class="pagination">
                <li class='${this._currentPage === 1 ? "disabled" : ""}'>
                    <a @click="${() => this.setPage(1)}">
                        <fa-icon icon="fa fa-angle-double-left"></fa-icon>
                    </a>
                </li>
                <li class='${this._currentPage === 1 ? "disabled" : ""}'>
                    <a @click="${() => this.decrement()}">
                        <fa-icon icon="fa fa-angle-left"></fa-icon>
                    </a>
                </li>

                ${this._pagesArr.map(page => html`
                    <li class='${this._currentPage === page ? "active" : ""}'>
                        <a @click="${() => this.setPage(page)}">
                            ${page}
                        </a>
                    </li>
                `)}
                               
                <li class='${this._currentPage === this._pagesTotal ? "disabled" : ""}'>
                    <a @click="${() => this.increment()}">
                        <fa-icon icon="fa fa-angle-right"></fa-icon>
                    </a>
                </li>
                <li class='${this._currentPage === this._pagesTotal ? "disabled" : ""}'>
                    <a @click="${() => this.setPage(this._pagesTotal)}">
                        <fa-icon icon="fa fa-angle-double-right"></fa-icon>
                    </a>
                </li>
            </ul>

            <ul class="pagination">
                ${this._pageSizes.map(size => html`
                    <li class='${this._currentPageSize === size ? "active" : ""}'>
                        <a @click="${() => this.setPageSize(size)}">
                            ${size}
                        </a>
                    </li>
                `)}
            </ul>
        </div>
        `
    }
    createRenderRoot() {
        return this
    }
}
