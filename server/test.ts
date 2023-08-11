import { getCommentStats } from "./mongoStats"

async function main() {
    const values = await getCommentStats("itavisen")
    console.log(values)
}

main().catch(er => {
    console.error(er)
})
.finally(() => {
    console.log("done")
    process.exit()
})