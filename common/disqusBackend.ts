import http from "@common/backendHttp"
import { CommentsStatsDay, DisqusForumInfo, DisqusUsersResponse, ForumRequest, PaginatedComments, SearchRequest } from "@common/types"

export function searchPostsBase(req: SearchRequest) {
    return http.post<PaginatedComments>("getcommentsby", req)
}

export function searchPosts(forum: string, page: number, pageSize: number, username?: string, authorname?: string, text?: string) {
    const data: SearchRequest = {
        forum, username, authorname, text,
        pagination: {
            page,
            pageSize
        }
    }
    return searchPostsBase(data)
}

export function getPostsByThread(forum: string, thread: string, page: number, pageSize: number) {
    const data: SearchRequest = {
        forum, thread,
        pagination: {
            page,
            pageSize
        }
    }
    return http.post<PaginatedComments>("getcommentsby", data)
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
export function mostActiveUsers(forum: string) {
    const data: ForumRequest = {
        forum
    }
    return http.post<DisqusUsersResponse>("mostActiveUsers", data)
}
export function mostLikedUsers(forum: string) {
    const data: ForumRequest = {
        forum
    }
    return http.post<DisqusUsersResponse>("mostLikedUsers", data)
}