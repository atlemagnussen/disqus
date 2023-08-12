import { LitElement, css, html } from "lit"
import { customElement, state } from "lit/decorators.js"
import {createRef, ref} from "lit/directives/ref.js"
import { getStats } from "@common/disqusBackend"
import { CommentsStatsDay } from "@common/types"
import { getChart, updateChart } from "./highCharts"
import { Chart } from "highcharts"

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
    forum = "itavisen"
    async selectChangeEvent(e: any) {
        this.forum = e.target.value
        const stats = await getStats(this.forum)
        if (this.chart)
            updateChart(this.chart, stats)
    }

    @state()
    stats: CommentsStatsDay[] = []

    chartDivRef = createRef<HTMLDivElement>()
    chart: Chart | null = null


    async firstUpdated() {
        const stats = await getStats(this.forum)
        if (this.chartDivRef.value) {
            const divEl = this.chartDivRef.value
            this.chart = getChart(divEl, stats)
        }
    }
    render() {
        return html`
            <div>
                <forum-selector @change=${this.selectChangeEvent}></forum-selector>
            </div>
            <div id="chart" class="highcharts-dark" ${ref(this.chartDivRef)}></div>
        `
    }
}
