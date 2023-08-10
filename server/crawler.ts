import { logger } from "./logger"
import { getPostsFromForum } from "./disqus"
import { DisqusPostsResponse } from "@common/types"

logger.info("crawler starting")


async function crawl() {
    const res = await getPosts()


    
}

async function getPosts() {
    const res = await getPostsFromForum("itavisen")
    const resJson = JSON.parse(res) as DisqusPostsResponse
    return resJson
}

crawl().catch(er => {
    logger.error(er)
})
.finally(() => {
    logger.info("done")
})