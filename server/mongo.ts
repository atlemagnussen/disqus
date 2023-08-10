import { MongoClient } from "mongodb"
import { DisqusCommentItem } from "@common/types"
import config from "./config"

// const url = "mongodb://localhost:27017"
const client = new MongoClient(config.mongoConnStr)
const projectFields = { "message": 1, "forum": 1, "thread": 1, "createdAt": 1, "author": 1}

export const getCommentsByAuthor = async (collName: string, author: string) => {
    await client.connect()

    const db = client.db(config.dbName)
    const collection = db.collection(collName)

    const filteredDocs = await collection.find({ "author.username": author })
        .project(projectFields)
        .toArray()
    console.log("filteredDocs length=", filteredDocs.length)

    client.close()
    return filteredDocs as DisqusCommentItem[]
}

export const getCommentsByThread = async (collName: string, thread: string) => {
    await client.connect()

    const db = client.db(config.dbName)
    const collection = db.collection(collName)

    const filteredDocs = await collection.find({ thread })
        .project(projectFields)
        .toArray()
    console.log("filteredDocs length=", filteredDocs.length)

    client.close()
    return filteredDocs as DisqusCommentItem[]
}