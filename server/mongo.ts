import { logger } from "./logger"
import { Collection, Document, MongoClient, UpdateOptions } from "mongodb"
import { DisqusCommentItem, DisqusOriginalComment } from "@common/types"
import config from "./config"

// const url = "mongodb://localhost:27017"
const client = new MongoClient(config.mongoConnStr)
const projectFields = { "message": 1, "forum": 1, "thread": 1, "createdAt": 1, "author": 1, "likes": 1, "dislikes": 1}

export const getCommentsByAuthor = async (collName: string, author: string) => {
    await client.connect()

    const db = client.db(config.dbName)
    const collection = db.collection(collName)

    const filteredDocs = await collection.find({ "author.username": author })
        .sort({ "createdAt": -1})
        .project(projectFields)
        .toArray()
    
    logger.info("filteredDocs length=", filteredDocs.length)

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
    
    logger.info("filteredDocs length=", filteredDocs.length)

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

    if (exists)
        UpdateComment(coll, comment)
    else
        await coll.insertOne(comment)
    
        return true
}

async function UpdateComment(coll: Collection<Document>, comment: DisqusOriginalComment) {
    const options: UpdateOptions = { upsert: true }
    const filter = { id: comment.id };
    const updateDoc = {
        $set: {
            message: comment.message,
            raw_message: comment.raw_message
        }
    }
    const result = await coll.updateOne(filter, updateDoc, options)
    logger.info(`Update:: Matched ${result.matchedCount} docs, Modified ${result.modifiedCount} docs`)
    return result
}

export async function findDuplicates(collName: string) {
    await client.connect()

    const db = client.db(config.dbName)
    const coll = db.collection(collName)

    const aggregationPipeline = [
        {"$group" : { "_id": "$id", "count": { "$sum": 1 } } },
        {"$match": {"_id" :{ "$ne" : null } , "count" : {"$gt": 1} } }, 
        {"$project": {"name" : "$_id", "_id" : 0} }
    ]
    const duplicatesCursor = coll.aggregate(aggregationPipeline, { allowDiskUse: true})
    
    let ids: string[] = []
    let count = 0
    for await (const doc of duplicatesCursor) {
        count += 1
        ids.push(doc.name)
    }
    logger.info(`${count} duplicates`)
    logger.info("duplicate ids", ids)

    return ids
}

export async function removeDuplicates(collName: string, ids: string[]) {
    await client.connect()

    const db = client.db(config.dbName)
    const coll = db.collection(collName)

    for (let i = 0; i < ids.length; i++) {
        let id = ids[i]
        logger.info("remove id", id)
        const res = await coll.deleteOne({id})
        logger.info(`Removed ${res.deletedCount}`)
    }
}