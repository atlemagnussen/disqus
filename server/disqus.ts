import { getHttps } from "./httpPromise"
import config from "./config"

const BASEURL = "https://disqus.com/api/3.0"
const THREADSURL = "/forums/listThreads.json"
// const FORUM = "itavisen"
// const THREADID = "6607646921";

export const getForumLink = async (forum: string, thread: string) => {
    const url = `${BASEURL}${THREADSURL}?api_key=${config.apiKey}&forum=${forum}&thread=${thread}`
    const res = await getHttps(url)
    if (res) {
        if (res.response && Array.isArray(res.response)) {
            const thread = res.response[0]
            return thread
        } else {
            throw new Error("no array")
        }
    } else {
        throw new Error("no response")
    }
}
