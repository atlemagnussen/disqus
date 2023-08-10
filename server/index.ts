import path from "path"
import express from "express"
import { getCommentsByAuthor, getCommentsByThread } from "./mongo"
import { getForumLink } from "./disqus"
import bodyParser from "body-parser"
import { DisqusCommentItem, ForumRequest, SearchRequest } from "@common/types"
import config from "./config"

const app = express()
app.use(bodyParser.json())

const rootFolder = __dirname
console.log("rootFolder", rootFolder)
const client = path.resolve("..", "client/dist")
const clientIndex = path.resolve(client, "index.html")

app.post("/getcommentsby", async (req, res) => {
    let fullpath = decodeURI(req.path)
    console.log("requested file path", fullpath)

    let docs: DisqusCommentItem[] = []
    const searchReq = req.body as SearchRequest
    if (searchReq.author) {
        docs = await getCommentsByAuthor("disqus", searchReq.forum, searchReq.author)
    } else if(searchReq.thread) {
        docs = await getCommentsByThread("disqus", searchReq.forum, searchReq.thread)
    }
    
    return res.send(docs)
})

app.post("/forumlink", async (req, res) => {
    let fullpath = decodeURI(req.path)
    console.log("requested file path", fullpath)

    const forumReq = req.body as ForumRequest

    const link = await getForumLink(forumReq.forum, forumReq.thread)
    return res.send(link)
})

app.use(express.static(client))

app.get('*', function (req, res) {
    console.log(req.path)
    res.sendFile(clientIndex)
})

let port = config.port ? config.port : 5000
app.listen(port, '0.0.0.0', () => {
    console.log(`[server]: Server is running at http://localhost:${port}`)
})
