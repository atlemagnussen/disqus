import { getForumLink } from "./disqus"



function dowork() {
    getForumLink("7021459969").then(th => {
        console.log(th)
    })
    .catch(er => {
        console.error(er)
    })
}

dowork()