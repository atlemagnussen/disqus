import { LitElement, css, html } from "lit"
import { customElement, property } from "lit/decorators.js"
import { forums } from "@app/services/config"

@customElement('forum-selector')
export class ForumSelector extends LitElement {
    static styles = css`
        :host {
            display: inline-block;
        }
    `
    @property({attribute: true})
    value = forums[0]

    selectChangeEvent(e: any) {
        this.value = e.target.value
        const changeEvent = new Event("change", {
            bubbles: true,
            composed: true
        })
        this.dispatchEvent(changeEvent)
    }
    render() {
        
        return html`
            <select @change=${this.selectChangeEvent}>
                ${forums.map(f => {
                    return html`<option value="${f}">${f}</option>`
                })}
            </select>
        `
    }
}
