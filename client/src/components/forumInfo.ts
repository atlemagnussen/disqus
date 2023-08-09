import { DisqusForumInfo } from "@common/types"
import { LitElement, css, html } from "lit"
import { customElement, property, state } from "lit/decorators.js"
import { getForumInfo } from "@common/disqusBackend"


@customElement('forum-info')
export class ForumInfo extends LitElement {
    static styles = css`
        :host {
            display: flex;
            flex-direction: column;
            padding: 0.3rem;
        }
        .link {
            color: var(--yellow-dark);
            cursor: pointer;
        }
        a, a:visited {
            color: var(--link-color);
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
    forumInfo: DisqusForumInfo = { title: "", clean_title: "", signedLink: "", link: "", slug: "", posts: 0 }

    render() {
        
        return html`
            <article>
                <p>Forum: ${this.forum} Thread Id: ${this.thread}</p>
                ${this.forumInfo.posts ? 
                    html`
                        <h3>
                            Title: ${this.forumInfo.title}<br>
                        </h3>
                        <p>
                            Posts: ${this.forumInfo.posts}<br>
                            <a href="${this.forumInfo.signedLink}" target="_blank">Disqus link</a><br>
                            <a href="${this.forumInfo.link}" target="_blank">Direct link</a>
                        </p>
                    ` : 
                    html`<span>Loading</span>`
                }
            </article>
        `
    }
}
