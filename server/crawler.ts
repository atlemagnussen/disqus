import { logger } from "./logger"
import { getPostsFromForum } from "./disqus"
import { SaveComment }from "./mongo"
import { DisqusPostsResponse } from "@common/types"

logger.info("crawler starting")

const FORUM = "itavisen"

async function crawl() {
    const res = await getPosts()

    const result = await processFetchedPosts(res)
    logger.info("result of saving posts", result)
    
    logger.info("cursor", res.cursor)
}

async function getPosts() {
    const res = await getPostsFromForum(FORUM)
    const resJson = JSON.parse(res) as DisqusPostsResponse
    return resJson
}

async function processFetchedPosts(res: DisqusPostsResponse) {
    let result = {
        total: 0,
        saved: 0
    }
    if (!res || !res.response || res.response.length === 0) {
        logger.warn("No posts in res")
        return result
    }
    logger.info(`Starting saving posts, count=${res.response.length}`)
    result.total = res.response.length

    for (let i = 0; i < res.response.length; i++) {
        let post = res.response[i]
        let saved = await SaveComment(FORUM, post)
        if (saved)
            result.saved += 1
    }
    return result
}

crawl().catch(er => {
    logger.error(er)
})
.finally(() => {
    logger.info("done")
})