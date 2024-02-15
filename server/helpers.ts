export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

export function calcTimeDiff(start: Date, end: Date) {
    let diffSec = Math.round((end.getTime()-start.getTime()) / 1000)
    
    let diffMin = 0
    if (diffSec > 60) {
        const diffSecMod = diffSec % 60
        const restSec = diffSec - diffSecMod
        diffMin = restSec / 60
        diffSec = diffSecMod
    }
    
    let diffHours = 0
    if (diffMin > 60) {
        const diffMinMod = diffMin % 60
        const restMin = diffMin - diffMinMod
        diffHours = restMin / 60
        diffMin = diffMinMod
    }
    let diffDays = 0
    if (diffHours > 24) {
        const diffHoursMod = diffHours % 24
        const restHours = diffHours - diffHoursMod
        diffDays = restHours / 24
        diffHours = diffHoursMod
    }
    return `${diffDays}days, ${diffHours}hours, ${diffMin}mins, ${diffSec}s`
}