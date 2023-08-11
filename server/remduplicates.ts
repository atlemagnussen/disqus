import { findDuplicates, removeDuplicates } from "./mongoComments"

const FORUM = "itavisen"

async function dowork() {
    const ids = await findDuplicates(FORUM)
    // await removeDuplicates(FORUM, ids)
}

dowork().catch(er => {
    console.error(er)
}).finally(() => {
    console.info("done")
})