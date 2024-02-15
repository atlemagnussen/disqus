import { logger } from "./logger"
import { getPostsFromForum } from "./disqus"
import { SaveComment }from "./mongoComments"
import { DisqusPostsResponse } from "@common/types"
import { sleep, calcTimeDiff } from "./helpers"
import config from "./config"

logger.info("crawler starting")

async function crawl() {
    let res = await getPosts()

    const result = await processFetchedPosts(res)
    logger.info("result of saving posts", result)
    
    while (res.cursor && res.cursor.hasNext) {
        logger.info(`Has cursor next: ${res.cursor.next}`)

        res = await getPosts(res.cursor.next)
        const result = await processFetchedPosts(res)
        logger.info("result of saving posts", result)
        logger.info(`Now sleep ${config.sleepMs}ms`)
        await sleep(config.sleepMs)
    }
}

async function getPosts(cursor?: string) {
    const res = await getPostsFromForum(config.forum, cursor)
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
        let saved = await SaveComment(config.forum, post)
        if (saved)
            result.saved += 1
    }
    return result
}

const startTime = new Date()

console.log("-----------------------------")
console.log("-------START CRAWLING--------")
console.log(`-------${config.forum}--------------`)
console.log(`-------${config.sleepMs}ms--------------`)
console.log("-----------------------------")
crawl().catch(er => {
    logger.error(er)
})
.finally(() => {
    const endTime = new Date()
    const diff = calcTimeDiff(startTime, endTime)
    logger.info(`Done scraping ${config.forum}: Job lasted for ${diff}`)
    process.exit()
})