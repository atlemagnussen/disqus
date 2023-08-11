import http from "@common/backendHttp"
import { DisqusCommentItem, DisqusForumInfo, ForumRequest, SearchRequest } from "@common/types"

export function getPostsByAuthor(forum: string, username?: string, authorname?: string) {
    const data: SearchRequest = {
        forum, username, authorname
    }
    return http.post<DisqusCommentItem[]>("getcommentsby", data)
}

export function getPostsByThread(forum: string, thread: string) {
    const data: SearchRequest = {
        forum, thread
    }
    return http.post<DisqusCommentItem[]>("getcommentsby", data)
}

export function getForumInfo(forum: string, thread: string) {
    const data: ForumRequest = {
        forum, thread
    }
    return http.post<DisqusForumInfo>("forumlink", data)
}