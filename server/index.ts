import path from "path"
import express from "express"
import { searchComments } from "./mongoComments"
import { getCommentStats } from "./mongoStats"
import { getForumLink, mostActiveUsers, mostLikedUsers } from "./disqus"
import bodyParser from "body-parser"
import { DisqusCommentItem, DisqusUsersResponse, ForumRequest, PaginatedComments, SearchRequest } from "@common/types"
import config from "./config"

const app = express()
app.use(bodyParser.json())

const rootFolder = __dirname
console.log("rootFolder", rootFolder)
const client = path.resolve("..", "client/dist")
const clientIndex = path.resolve(client, "index.html")

app.post("/api/getcommentsby", async (req, res) => {
    let fullpath = decodeURI(req.path)
    console.log("requested file path", fullpath)

    let resComments: PaginatedComments = {
        data: [],
        pagination: {
            page: 1,
            pageSize: 100,
        }
    }
    const searchReq = req.body as SearchRequest
    try {
        resComments = await searchComments(searchReq)
    }
    catch(er: any) {
        console.log("ERROR GETTING DOCS!")
        console.error(er.message)
        return res.status(400).json({message: er.message})
    }
    return res.send(resComments)
})

app.post("/api/forumlink", async (req, res) => {
    let fullpath = decodeURI(req.path)
    console.log("requested file path", fullpath)

    const forumReq = req.body as ForumRequest

    const link = await getForumLink(forumReq.forum, forumReq.thread!)
    return res.send(link)
})

app.post("/api/stats", async (req, res) => {
    let fullpath = decodeURI(req.path)
    console.log("requested file path", fullpath)

    const forumReq = req.body as ForumRequest

    const stats = await getCommentStats(forumReq.forum)
    return res.send(stats)
})

app.post("/api/mostactiveusers", async (req, res) => {
    const forumReq = req.body as ForumRequest

    const actUsers = await mostActiveUsers(forumReq.forum)
    const actUsersJson = JSON.parse(actUsers)
    res.send(actUsersJson)
})

app.post("/api/mostLikedUsers", async (req, res) => {
    const forumReq = req.body as ForumRequest

    const likedUsers = await mostLikedUsers(forumReq.forum)
    const likedUsersJson = JSON.parse(likedUsers) as DisqusUsersResponse
    res.send(likedUsersJson)
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
