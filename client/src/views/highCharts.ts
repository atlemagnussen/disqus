import { CommentsStatsDay } from "@common/types"
import Highcharts from "highcharts"

// const bgCol = {
//     linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
//     stops: [
//         [0, 'rgb(3, 3, 3)'],
//         [1, 'rgb(5, 5, 5)']
//     ]
// }

Highcharts.theme = {
    colors: ['#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572',
             '#FF9655', '#FFF263', '#6AF9C4'],
    chart: {
        backgroundColor: "var(--primary-background)",
        borderColor: "#333",
        plotBorderColor: "#444"
    },
    title: {
        style: {
            color: '#000',
            font: 'bold 16px "Trebuchet MS", Verdana, sans-serif'
        }
    },
    subtitle: {
        style: {
            color: '#666666',
            font: 'bold 12px "Trebuchet MS", Verdana, sans-serif'
        }
    },
    legend: {
        itemStyle: {
            font: '9pt Trebuchet MS, Verdana, sans-serif',
            color: 'black'
        },
        itemHoverStyle:{
            color: 'gray'
        }
    },
    xAxis: {
        gridLineColor: "#555",
        lineColor: "#555",
        tickColor: "#666",
        minorTickColor: "#777",
        // alternateGridColor: "#333",
        minorGridLineColor: "#999",
        labels: {
            style: {
                color: "#AAA"
            }
        }
    },
    yAxis: {
        gridLineColor: "#555",
        lineColor: "#555",
        tickColor: "#666",
        // minorTickColor: "#777",
        // alternateGridColor: "#333",
        // minorGridLineColor: "#999",
        title: {
            style: {
                color: "#BBB"
            }
        },
        labels: {
            style: {
                color: "#AAA"
            }
        }
    }
}
// Apply the theme
Highcharts.setOptions(Highcharts.theme)

export function updateChart(chart: Highcharts.Chart, stats: CommentsStatsDay[]) {
    const data = stats.map(s => {
        return [new Date(s.day).getTime(), s.count]
    })
    
    chart.update({
        series: [
            {
                type: "area",
                name: 'Comments',
                data
            }
        ]
    })
}

export function getChart(element: HTMLElement, stats: CommentsStatsDay[]) {

    const data = stats.map(s => {
        return [new Date(s.day).getTime(), s.count]
    })

    // const hOptions = Highcharts.getOptions()
    // const hColors = hOptions.colors as string[]
    // const color1 =  hColors[0]
    // const color2 = Highcharts.color(color1).setOpacity(0).get('rgba') as string

    const options: Highcharts.Options = {
        title: {
            text: 'Disqus',
            style: {
                color: "#FFF"
            }
        },
        xAxis: {
            type: 'datetime'
        },
        yAxis: {
            title: {
                text: 'Comments'
            }
        },
        legend: {
            enabled: false
        },
        plotOptions: {
            area: {
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

