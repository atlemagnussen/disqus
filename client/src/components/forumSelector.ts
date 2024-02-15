import { LitElement, css, html } from "lit"
import { customElement, property } from "lit/decorators.js"


@customElement('forum-selector')
export class ForumSelector extends LitElement {
    static styles = css`
        :host {
            display: inline-block;
        }
    `
    @property({attribute: true})
    value = "itavisen"

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
                <option value="itavisen">itavisen</option>
                <option value="digi-no">digi</option>
                <option value="documentno">Document</option>
            </select>
        `
    }
}
