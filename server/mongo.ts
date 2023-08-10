import { MongoClient } from "mongodb"
import { DisqusCommentItem } from "@common/types"
import config from "./config"

// const url = "mongodb://localhost:27017"
const client = new MongoClient(config.mongoConnStr)
const projectFields = { "message": 1, "forum": 1, "thread": 1}

export const getCommentsByAuthor = async (dbName: string, collName: string, author: string) => {
    await client.connect()

    const db = client.db(dbName)
    const collection = db.collection(collName)

    const filteredDocs = await collection.find({ "author.username": author })
        .project(projectFields)
        .toArray()
    console.log("filteredDocs length=", filteredDocs.length)

    client.close()
    return filteredDocs as DisqusCommentItem[]
}

export const getCommentsByThread = async (dbName: string, collName: string, thread: string) => {
    await client.connect()

    const db = client.db(dbName)
    const collection = db.collection(collName)

    const filteredDocs = await collection.find({ thread })
        .project(projectFields)
        .toArray()
    console.log("filteredDocs length=", filteredDocs.length)

    client.close()
    return filteredDocs as DisqusCommentItem[]
}