import { logger } from "./logger"
import { getHttps } from "./httpPromise"
import config from "./config"

const BASEURL = "https://disqus.com/api/3.0"
const THREADSURL = "/forums/listThreads.json"
const POSTSURL = "/forums/listPosts.json"

// const FORUM = "itavisen"
// const THREADID = "6607646921";

export const getForumLink = async (forum: string, thread: string) => {
    const url = `${BASEURL}${THREADSURL}?api_key=${config.apiKey}&forum=${forum}&thread=${thread}`
    const res = await getHttps(url)
    if (res) {
        const resJson = JSON.parse(res)
        if (resJson.response && Array.isArray(resJson.response)) {
            const thread = res.response[0]
            return thread
        } else {
            throw new Error("no array")
        }
    } else {
        throw new Error("no response")
    }
}

export const getPostsFromForum = async (forum: string, cursor?: string) => {
    logger.info(`Fetching for ${forum}`)
    let url = `${BASEURL}${POSTSURL}?api_key=${config.apiKey}&forum=${forum}`
    if (cursor)
        url = `${url}&cursor=${cursor}`

    logger.info(`Fetching url ${url}`)
    
    const res = await getHttps(url)
    return res
}