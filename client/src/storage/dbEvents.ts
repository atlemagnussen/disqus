import { BehaviorSubject } from "rxjs"

const dbStateChanged = new BehaviorSubject(0)

export const dbState = dbStateChanged.asObservable()

export function incrementDbState() {
    const current = dbStateChanged.value
    dbStateChanged.next(current+1)
}