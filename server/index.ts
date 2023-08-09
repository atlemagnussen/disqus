import path from "path"
import express from "express"


const app = express()
// app.use(bodyParser.json())

const rootFolder = __dirname
console.log("rootFolder", rootFolder)
const client = path.resolve("..", "client/dist")
const clientIndex = path.resolve(client, "index.html")

app.get("/author/*", (req, res) => {
    let fullpath = decodeURI(req.path)
    console.log("requested file path", fullpath)
    return res.send({"hello": "world"})
})

app.use(express.static(client))

app.get('*', function (req, res) {
    res.sendFile(clientIndex)
})

// app.get('*', (req, res) => {
//     let path = decodeURI(req.path)
//     console.log("path*", path)
//     const html = generateHtmlFromDir(path)
//     res.send(html)
// })

let port = 5000
app.listen(port, '0.0.0.0', () => {
    console.log(`[server]: Server is running at http://localhost:${port}`)
})
