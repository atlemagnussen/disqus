import { logger } from "./logger"
import { getPostsFromForum } from "./disqus"

logger.info("crawler starting")


function crawl() {
    getPostsFromForum("itavisen").then(res => {
        console.log(res)
    })
    .catch(er => {
        console.error(er)
    })
    .finally(() => {
        console.log("done")
    })
}

crawl()