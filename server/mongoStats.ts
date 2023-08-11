import { CommentsStatsDay } from "@common/types"
import { getCollection  } from "./mongo"

export async function getCommentStats(collName: string) {
    const coll = await getCollection(collName)

    const aggr = [
        {
            "$project": {
                "date": {
                    $dateFromString: {
                        dateString: '$createdAt'
                    }
                }
            }
        },
        {
            "$group": {
                _id: {
                    "$dateToString": { 
                        format: "%Y-%m-%d", 
                        date: "$date"
                    } 
                }, 
                count: {
                    $sum: 1
                }
            }
        },
        {
            "$project": {
                "day": {
                    $dateFromString: {
                        dateString: '$_id'
                    }
                },
                "count": 1
            }
        },
        {
            "$sort": { 
                day : 1
            }
        }
    ]

    const docs: CommentsStatsDay[] = []
    const cursor = coll.aggregate(aggr)
    for await (const doc of cursor) {
        docs.push(doc as CommentsStatsDay)
    }
    return docs
}