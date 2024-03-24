import { DisqusForumInfo } from "@common/types"
import { LitElement, css, html } from "lit"
import { customElement, property, state } from "lit/decorators.js"
import { getForumInfo } from "@common/disqusBackend"


@customElement('forum-link')
export class ForumLink extends LitElement {
    static styles = css`
        :host {
            display: inline;
        }
    `

    @property({attribute: true})
    forum = ""

    @property({attribute: true})
    thread = ""

    connectedCallback(): void {
        super.connectedCallback()
        if (this.thread)
            this.fetchInfo()
    }

    async fetchInfo() {
        this.forumInfo = await getForumInfo(this.forum, this.thread)
    }

    @state()
    forumInfo: DisqusForumInfo = {id: "", forum: "", title: "", clean_title: "", signedLink: "", link: "", slug: "", posts: 0 }

    render() {
        
        return html`
            ${this.forumInfo.link}
        `
    }
}
