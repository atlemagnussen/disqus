import { LitElement, css, html } from "lit"
import { customElement, state } from "lit/decorators.js"
import {createRef, ref} from "lit/directives/ref.js"
import { getStats } from "@common/disqusBackend"
import { CommentsStatsDay } from "@common/types"
import { getChart } from "./highCharts"

@customElement('stats-view')
export class StatsView extends LitElement {
    static styles = css`
        :host {
            display: flex;
            flex-direction: column;
            justify-content: center;
            height: 100%;
            max-width: 100%;
            width: 100%;
        }
        div#chart {
            flex: 1 1 auto 
        }
    `

    @state()
    stats: CommentsStatsDay[] = []

    chartDivRef = createRef<HTMLDivElement>()

    async fetchStats() {
        const stats = await getStats()
        this.stats = stats
    }
    connectedCallback(): void {
        super.connectedCallback()
    }

    async firstUpdated() {
        await this.fetchStats()
        if (this.chartDivRef.value) {
            const divEl = this.chartDivRef.value
            const chart = getChart(divEl, this.stats)
            console.log(chart)
        }
            
    }
    render() {
        return html`
            <div>
                <p>Chart</p>
            </div>
            <div id="chart" class="highcharts-dark" ${ref(this.chartDivRef)}></div>
        `
    }
}
