export interface DisqusCommentItem {
    message: string,
    forum: string
    thread: string
    createdAt?: string
    author?: DisqusAuthor
    likes: number
    dislikes: number
}

export interface DisqusUser {
    id: string
    username: string
    name: string
    profileUrl: string
    location: string
    isPrivate: boolean
    isAnonymous: boolean
    reputation: number
    numPosts?: number
    numVotes?: number
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
    username?: string
    authorname?: string
    text?: string
}

export interface ForumRequest {
    forum: string
    thread?: string
}

export interface DisqusOriginalComment {
    forum: string
    thread: string
    id: string
    parent: string
    message: string
    raw_message: string
    createdAt: string
    editableUntil: string
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

export interface DisqusApiResponse {
    cursor: DisqusCursor
    code: number
}

export interface DisqusPostsResponse extends DisqusApiResponse{
    response: DisqusOriginalComment[]
}

export interface DisqusThreadResponse extends DisqusApiResponse {
    response: DisqusForumInfo[]
}

export interface ErrorDetails {
    message: string
}


export interface CommentsStatsDay {
    day: Date
    count: number
}