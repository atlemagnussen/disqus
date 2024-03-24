import { getHttps } from "./httpPromise"
import config from "./config"

const BASEURL = "https://disqus.com/api/3.0"

/** No access */
export async function listForumsByUserId(user: number) {
    const url = `${BASEURL}/users/listForums.json?api_key=${config.apiKey}&user=${user}`
    const res = await getHttps(url)
    return res
}

export async function detailsOnUser(user: number) {
    const url = `${BASEURL}/users/details.json?api_key=${config.apiKey}&user=${user}`
    const res = await getHttps(url)
    return res
}

/** You do not have enough privileges to access this resource. */
export async function listMostActiveForumsOnUser(user: number) {
    const url = `${BASEURL}/users/listActivity.json?api_key=${config.apiKey}&user=${user}`
    const res = await getHttps(url)
    return res
}
