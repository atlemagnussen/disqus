import http from "@common/backendHttp"
import { DisqusCommentItem, DisqusForumInfo, ForumRequest, SearchRequest } from "@common/types"

export function getPostsByAuthor(forum: string, author: string) {
    const data: SearchRequest = {
        forum, author
    }
    return http.post<DisqusCommentItem[]>("getcommentsby", data)
}

export function getForumInfo(forum: string, thread: string) {
    const data: ForumRequest = {
        forum, thread
    }
    return http.post<DisqusForumInfo>("forumlink", data)
}