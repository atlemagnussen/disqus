export interface DisqusCommentItem {
    message: string,
    forum: string
    thread: string
}

export interface DisqusForumInfo {
    title: string
    clean_title: string
    signedLink: string
    link: string
    slug: string
    posts: number
}

export interface SearchRequest {
    forum: string
    thread?: string
    author?: string
}

export interface ForumRequest {
    forum: string
    thread: string
}