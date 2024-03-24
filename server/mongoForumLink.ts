import { DisqusForumInfo } from "@common/types"
import { getForumLink } from "./disqus"
import { getCollection } from "./mongo"
import { Collection, Document } from "mongodb"

const collName = "forumlink"

export async function getForumLinkCached(forum: string, thread: string) {

    const coll = await getCollection(collName)

    const cached = await getForumLinkDb(coll, forum, thread)
    if (cached) {
        console.log("cached", cached.link)
        return cached
    } else {
        console.log("did not get cached")
    }

    const newInfo = await getForumLink(forum, thread)
    if (newInfo) {
        console.log("newInfo", newInfo.link)
        await saveForumLinkDb(coll, newInfo)
        return newInfo
    }
}

async function getForumLinkDb(coll: Collection<Document>, forum: string, thread: string) {
    

    const link = await coll.findOne({forum, id: thread}) as DisqusForumInfo | null
    return link
}

async function saveForumLinkDb(coll: Collection<Document>, forumInfo: DisqusForumInfo) {
    console.log("saving to...", collName)
    try {
        await coll.insertOne(forumInfo)
        console.log("saved=", forumInfo.id)
    }
    catch (er) {
        console.error("error inserting", er)
    }
}