import { DisqusOriginalComment, PaginatedComments, SearchRequest } from "@common/types"
import { getCollection  } from "./mongo"
import { AggregateOptions, Collection, Document, UpdateOptions } from "mongodb"
import { logger } from "./logger"

const defaultPagingSize = 100

const projectFields = {
    "id": 1,
    "message": 1,
    "forum": 1,
    "thread": 1,
    "parent": 1,
    "createdAt": 1,
    "author": 1,
    "likes": 1,
    "dislikes": 1,
    "isSpam": 1,
    "isDeletedByAuthor": 1,
    "isDeleted": 1,
    "isFlagged": 1,
    "isApproved": 1,
    "date": {
        $dateFromString: {
            dateString: '$createdAt'
        }
    }
}

export const searchComments = async (search: SearchRequest) => {
    
    const coll = await getCollection(search.forum)

    let page = 1
    let pageSize = defaultPagingSize

    if (search.pagination) {
        if (search.pagination.page)
            page = search.pagination.page
        if (search.pagination.pageSize)
            pageSize = search.pagination.pageSize
    }

    let skip = 0
    if (page > 1)
        skip = (page - 1) * pageSize

    console.log(`skip=${skip}, pageSize=${pageSize}`)

    const match = getMatchQuery(search)
    const aggregate = [
        {
            "$match": match
        },
        {
            "$project": projectFields
        },
        {
            "$sort": { 
                date : -1
            }
        },
        {
            "$facet": {
              "data": [
                { "$skip": skip },
                { "$limit": pageSize }
              ],
              "pagination": [
                {
                    "$count": "totalCount",
                }
              ]
            }
        }
    ]
    const aggOptions: AggregateOptions = { allowDiskUse: true}
    const cursor = coll.aggregate(aggregate, aggOptions)

    const docs = await cursor.toArray() as PaginatedComments[]
    logger.info(`Found ${docs.length} paginated results`)
    const res = docs[0]

    /// @ts-ignore
    if (res.pagination && res.pagination.length > 0) {
        /// @ts-ignore
        res.pagination = res.pagination[0]
    }
    else {
        res.pagination = {
            totalCount: 0,
            page,
            pageSize
        }
    }

    res.pagination.pageSize = pageSize
    res.pagination.page = page
    return res
}

function getMatchQuery(s: SearchRequest) {
    let expressions: Document[] = []

    if (s.thread)
        expressions.push({thread: s.thread })

    if (s.authorname)
        expressions.push({"author.name": s.authorname})

    if (s.username)
        expressions.push({"author.username": s.username})

    if (s.text)
        expressions.push({
            $text: {
                $search: s.text
            }
        })
    
    if (expressions.length == 0)
        throw new Error("need at least one filter")
    return {
        "$and": expressions
    }
}

export async function SaveComment(collName: string, comment: DisqusOriginalComment) {
    
    const coll = await getCollection(collName)

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
    
    const coll = await getCollection(collName)

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
    
    const coll = await getCollection(collName)

    for (let i = 0; i < ids.length; i++) {
        let id = ids[i]
        logger.info("remove id", id)
        const res = await coll.deleteOne({id})
        logger.info(`Removed ${res.deletedCount}`)
    }
}