export interface DisqusCommentItem {
    message: string,
    forum: string
    thread: string
    createdAt?: string
    author?: DisqusAuthor
}

export interface DisqusAuthor {
    username: string
    name: string
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

export interface DisqusOriginalComment {
    forum: string
    thread: string
    id: string
    parent: string
    message: string
    raw_message: string
    createdAt: string
    isEdited: boolean
    author: DisqusAuthor
    likes: number
    dislikes: number
    isSpam: boolean
    isDeletedByAuthor: boolean
    isDeleted: boolean
    isFlagged: boolean
    isAtFlagLimit: boolean
    isHighlighted: boolean
    isApproved: boolean
    isNewUserNeedsApproval: boolean
}

export interface DisqusCursor {
    hasNext: boolean
    next: string
    hasPrev: boolean
    prev: string
    id: string
    more: boolean
}

export interface DisqusPostsResponse {
    cursor: DisqusCursor
    code: number
    response: DisqusOriginalComment[]
}