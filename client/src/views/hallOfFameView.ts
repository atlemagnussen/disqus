import { LitElement, css, html } from "lit"
import { customElement, state } from "lit/decorators.js"
import { mostActiveUsers, mostLikedUsers } from "@common/disqusBackend"
import { DisqusUser } from "@common/types"


@customElement('hall-view')
export class HallView extends LitElement {
    static styles = css`
        :host {
            display: flex;
            flex-direction: column;
            justify-content: center;
            max-width: 100%;
            width: 100%;
        }
        header, article {
            display: flex;
            flex-direction: row;
        }
        section {
            flex: 1 1 auto;
        }
    `

    @state()
    mostActiveUsers: DisqusUser[] = []
    @state()
    mostLikedUsers: DisqusUser[] = []

    forum = "itavisen"
    async selectChangeEvent(e: any) {
        this.forum = e.target.value
        this.fetchData()
    }
    async fetchData() {
        const maR = await mostActiveUsers(this.forum)
        this.mostActiveUsers = maR.response
        const mlR = await mostLikedUsers(this.forum)
        this.mostLikedUsers = mlR.response
    }

    connectedCallback(): void {
        super.connectedCallback()
        this.fetchData()
    }

    render() {
        return html`
            <header>
                <h1>Hall of fame</h1>
                <forum-selector @change=${this.selectChangeEvent}></forum-selector>
            </header>
            <article>
                <section>
                    <h2>Most active users</h2>
                    <disqus-user-list .users=${this.mostActiveUsers}></disqus-user-list>
                </section>
                <section>
                    <h2>Most liked users</h2>
                    <disqus-user-list .users=${this.mostLikedUsers}></disqus-user-list>
                </section>
            </article>
            
        `
    }
}
