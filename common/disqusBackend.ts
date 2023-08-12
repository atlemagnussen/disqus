import http from "@common/backendHttp"
import { CommentsStatsDay, DisqusCommentItem, DisqusForumInfo, ForumRequest, SearchRequest } from "@common/types"

export function searchPosts(forum: string, username?: string, authorname?: string, text?: string) {
    const data: SearchRequest = {
        forum, username, authorname, text
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

export function getStats(forum: string) {
    const data: ForumRequest = {
        forum
    }
    return http.post<CommentsStatsDay[]>("stats", data)
}