import { SearchRequest } from "@common/types"
import { searchComments } from "./mongoComments"

async function main() {
    const req: SearchRequest = {
        forum: "itavisen",
        username: "RadonReady",
        pagination: {
            page: 3,
            pageSize: 10
        }
    }

    const res = await searchComments(req)
    console.log("data length", res.data.length)
    console.log("pagination", JSON.stringify(res.pagination, null, 2))
}

main().catch(er => {
    console.error(er)
})
.finally(() => {
    console.log("done")
    process.exit()
})