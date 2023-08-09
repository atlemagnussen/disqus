import https from "https"
import http from "http"
import url from "url"

export function getHttps(url: string) {

    return new Promise((resolve:(data:any)=>any, reject:(error:string)=>void) => {
        https.get(url, (res) => {
            if (res.statusCode === 301) {
                console.log(`Got redirect to ${res.headers.location}`)

                https.get(res.headers?.location!, (ress) => {
                    handle(ress, resolve, reject)
                })
            } else {
                handle(res, resolve, reject)
            }
        }).on('error', (e) => {
            reject(`Got error: ${e.message}`)
        })
    })
}

export function post(pUrl: string, data: any) {
    
    const body = JSON.stringify(data)
    const postUrl = url.parse(pUrl)
    const options = {
        "hostname": postUrl.hostname,
        "port": postUrl.port,
        "path": postUrl.path,
        "method": 'POST',
        "headers": {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Content-Length': Buffer.byteLength(body)
        }
    }
    return new Promise((resolve, reject) => {
        try {
            const req = https.request(options, (res) => {
                handle(res, resolve, reject)
            }).on('error', (e) => {
                reject(`Got error: ${e.message}`)
            });
            req.end(body)
        } catch (err) {
            reject(err)
        }
    })

}

function handle(res: http.IncomingMessage, resolve: (data:any)=>void, reject:(msg:string)=>void) {
    const {statusCode} = res
    let error: Error | null = null

    if (statusCode !== 200) {
        error = new Error(`Request Failed.\nStatus Code: ${statusCode}`);
        res.resume()
    }

    res.setEncoding('utf8')
    let rawData = ''
    res.on('data', (chunk: string) => {
        rawData += chunk
    })
    res.on('end', () => {
        const errmsg = `Status: ${statusCode} - msg: ${rawData}`
        if (error) {
            if (reject) {
                reject(errmsg)
            } else {
                throw new Error(errmsg)
            }
        } else {
            const parsedData = JSON.parse(rawData)
            resolve(parsedData)
        }
    })
}

