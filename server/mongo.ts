import { MongoClient } from "mongodb"
import config from "./config"

// const url = "mongodb://localhost:27017"
const client = new MongoClient(config.mongoConnStr)

export async function getCollection(collName: string) {
    
    await client.connect()

    const db = client.db(config.dbName)
    const coll = db.collection(collName)
    return coll
}