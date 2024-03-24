// import { SearchRequest } from "@common/types"
// import { searchComments } from "./mongoComments"
import config from "./config"
import { getForumLinkCached } from "./mongoForumLink"

console.log(config)

async function main() {
    const forum = "forum"
    const thread = "7028512497"

    const res = await getForumLinkCached(forum, thread)
    if (!res) {
        console.log("empty!")
        return
    }
    
    console.log("thread", thread)
    console.log("id====", res.id)
    console.log("link", res.link)
}

main().catch(er => {
    console.error(er)
})
.finally(() => {
    console.log("done")
    process.exit()
})

