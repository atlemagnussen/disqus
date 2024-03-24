import { findDuplicates, removeDuplicates } from "./mongoComments"

const FORUM = "forum"

async function dowork() {
    const ids = await findDuplicates(FORUM)
    // await removeDuplicates(FORUM, ids)
}

dowork().catch(er => {
    console.error(er)
}).finally(() => {
    console.info("done")
})