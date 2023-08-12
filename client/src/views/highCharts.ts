import { CommentsStatsDay } from "@common/types"
import Highcharts from "highcharts"

export function getChart(element: HTMLElement, stats: CommentsStatsDay[]) {

    const data = stats.map(s => {
        return [new Date(s.day).getTime(), s.count]
    })

    const hOptions = Highcharts.getOptions()
    const hColors = hOptions.colors as string[]
    const color1 =  hColors[0]
    const color2 = Highcharts.color(color1).setOpacity(0).get('rgba') as string

    const options: Highcharts.Options = {
        chart: {
            backgroundColor: '#222',
            borderColor: "#333",
            plotBorderColor: "#444"
        },
        title: {
            text: 'Disqus',
            style: {
                color: "#FFF"
            }
        },
        xAxis: {
            type: 'datetime',
            labels: {
                style: {
                    color: "#FFF"
                }
            }
        },
        yAxis: {
            title: {
                text: 'Comments',
                style: {
                    color: "#FFF"
                }
            },
            labels: {
                style: {
                    color: "#FFF"
                }
            }
        },
        legend: {
            enabled: false
        },
        plotOptions: {
            area: {
                fillColor: {
                    linearGradient: {
                        x1: 0,
                        y1: 0,
                        x2: 0,
                        y2: 1
                    },
                    stops: [
                        [0, color1],
                        [1, color2]
                    ]
                },
                marker: {
                    radius: 2
                },
                lineWidth: 1,
                states: {
                    hover: {
                        lineWidth: 1
                    }
                },
                threshold: null
            }
        },
        series: [
            {
                type: "area",
                name: 'Comments',
                data
            }
        ]
    }
    const chart = Highcharts.chart(element, options)
    return chart
}

