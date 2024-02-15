// import { SearchRequest } from "@common/types"
// import { searchComments } from "./mongoComments"
import config from "./config"
import { calcTimeDiff } from "./helpers"

console.log(config)

// async function main() {
//     const req: SearchRequest = {
//         forum: "itavisen",
//         username: "RadonReady",
//         pagination: {
//             page: 3,
//             pageSize: 10
//         }
//     }

//     const res = await searchComments(req)
//     console.log("data length", res.data.length)
//     console.log("pagination", JSON.stringify(res.pagination, null, 2))
// }

// main().catch(er => {
//     console.error(er)
// })
// .finally(() => {
//     console.log("done")
//     process.exit()
// })


const date1 = new Date()
console.log(date1.toISOString())

const date2 = new Date()
date2.setDate(date2.getDate() + 2)
date2.setHours(date2.getHours() + 4)
date2.setMinutes(date2.getMinutes() + 5)
date2.setSeconds(date2.getSeconds() + 6)
console.log(date2.toISOString())

const diff = calcTimeDiff(date1, date2)
console.log(diff)
