import {LitElement, html, css} from "lit"
import {customElement, property} from "lit/decorators.js"
import { formatDateTime, formatDateTimeShort } from "./timeFormatting"

@customElement('datetime-viewer')
export class DateTimeViewer extends LitElement {
    
    static styles = css`
        :host {
            display: inline;
        }
    `
    
    @property({attribute: true})
    date = ""

    @property({attribute: false})
    short = false

    render() {
        if (!this.date)
            return html`N/A`
        
        let formattedDate = ""
    
        if (this.short)
            formattedDate = formatDateTimeShort(this.date)
        else
            formattedDate = formatDateTime(this.date)
        
        return html`
            ${formattedDate}
        `
    }
}