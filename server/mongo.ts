import { MongoClient } from "mongodb"
import { DisqusCommentItem, DisqusOriginalComment } from "@common/types"
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

export async function SaveComment(collName: string, comment: DisqusOriginalComment) {
    await client.connect()

    const db = client.db(config.dbName)
    const coll = db.collection(collName)

    const exists = await coll.findOne({id: comment.id})
    const isOpenForEdit = new Date(comment.editableUntil) > new Date()

    if (exists && !isOpenForEdit)
        return false

    const res = await coll.insertOne(comment)
    return true
}