import type { SearchRequest } from "@common/types"
import type { SavedSearchRequest } from "@common/models"
import { cloneDeep } from "lodash-es"
import { incrementDbState } from "./dbEvents"

let db: IDBDatabase | undefined

const DBNAME = "disqus-trollbase"
const REQUESTSTABLE = "requeststore"

function openDb() : Promise<IDBDatabase>{
    return new Promise((resolve, reject) => {
        const dbReq = indexedDB.open(DBNAME, 1)
        dbReq.onsuccess = () => {
            db = dbReq.result
            resolve(dbReq.result)
        }
        dbReq.onerror = (er) => {
            reject(er)
        }
        dbReq.onupgradeneeded = () => {
            let dbu = dbReq.result
            const objectAudioStore = dbu.createObjectStore(REQUESTSTABLE, { keyPath: "name"})
            objectAudioStore.createIndex("name", "name", { unique: true })
        }
    })
}

const openDbPromise = openDb()

function getOneIem<T>(path: string): Promise<T> {
    
    return new Promise((resolve, reject) => {
        if (!db)
            reject("not connected")
        
        const store = db!.transaction([REQUESTSTABLE]).objectStore(REQUESTSTABLE)
        
        const req = store.get(path)
        req.onsuccess = () => resolve(req.result)
        req.onerror = err => reject(err)
    })
}

function getAll<T>(): Promise<T[]> {
    
    return new Promise((resolve, reject) => {
        if (!db)
            reject("not connected")
        
        const store = db!.transaction([REQUESTSTABLE]).objectStore(REQUESTSTABLE)
        
        const req = store.getAll()
        req.onsuccess = () => resolve(req.result)
        req.onerror = err => reject(err)
    })
}

function saveOneItem<T>(data: T, update: boolean): Promise<T> {
    return new Promise((resolve, reject) => {
        if (!db)
            reject("no db")
        
        const tx = db!.transaction([REQUESTSTABLE], "readwrite")
        tx.onerror = er => {
            reject(er)
        }
        const objectStore = tx.objectStore(REQUESTSTABLE)
        let req = update ? objectStore.put(data) : objectStore.add(data)
        
        req.onsuccess = () => {
            resolve(data)
        }
        req.onerror = ev => {
            reject(ev)
        }
    })
    
}

export async function saveSearchRequest(name: string, req: SearchRequest) {
    await openDbPromise
    
    const saveReq = cloneDeep(req) as SavedSearchRequest
    saveReq.name = name

    const exists = await getSavedRequest(name)
    await saveOneItem(saveReq, !!exists)
    incrementDbState()
}

export async function getSavedRequest(name: string) {
    await openDbPromise
    const value = await getOneIem<SavedSearchRequest>(name)
    return value
}

export async function getAllSavedRequests() {
    await openDbPromise
    const values = await getAll<SavedSearchRequest>()
    return values
}
