import { mostLikedUsers } from "./disqus"

async function main() {
    const values = await mostLikedUsers("itavisen")
    console.log(values)
}

main().catch(er => {
    console.error(er)
})
.finally(() => {
    console.log("done")
    process.exit()
})