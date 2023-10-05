
import { getAllSavedRequests } from "@app/storage/database"
import { SavedSearchRequest } from "@common/models"
import { LitElement, css, html } from "lit"
import { customElement, state } from "lit/decorators.js"
import { Subscription }from "rxjs"
import { dbState } from "@app/storage/dbEvents"

@customElement('favorite-searches')
export class DisqusUserList extends LitElement {
    static styles = css`
        :host {
            display: inline-flex;
            flex-direction: rows;
            padding: 0.3rem;
            gap: 1rem;
        }
    `

    private sub: Subscription | null = null
    @state()
    favorites: SavedSearchRequest[] = []

    async fetchFavs() {
        const favs = await getAllSavedRequests()
        if (favs && favs.length > 0)
            this.favorites = favs
        else
            this.favorites = []
    }


    starClicked() {
        this.dispatchCustomEvent("starclicked", {clicked: true})    
    }
    selectChangeEvent(e: any) {
        const value = e.target.value
        if (!value)
            return

        const req = this.favorites.find(f => f.name == value)
        if (req)
            this.dispatchCustomEvent("selectedfavorite", req)
    }
    dispatchCustomEvent(name: string, detail: any) {
        const options = { detail, bubbles: true, composed: true }
        this.dispatchEvent(new CustomEvent(name, options))
    }

    connectedCallback(): void {
        super.connectedCallback()
        this.fetchFavs()

        this.sub = dbState.subscribe(() => {
            this.fetchFavs()
        })
    }
    render() {
        return html`
            <select @change=${this.selectChangeEvent} title="Your saved favorite queries">
                <option value=""></option>
                ${this.favorites.map(f => html`<option .value=${f.name}>${f.name}</option>`)}
            </select>
            <star-button 
                title="click to save favorite search"
                @click=${this.starClicked}>
            </star-button>
        `
    }
    disconnectedCallback(): void {
        super.disconnectedCallback()
        if (this.sub)
            this.sub.unsubscribe()
    }
}
