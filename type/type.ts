export type BigVideoDataType = {
    videoData: VideoDataType,
    channelData: ChannelDataType,
    commentData: CommentDataType[]
}


export type CommentDataType = {
    id: number,
    videoId: number,
    accountId: number,
    content: string,
    status: number,
    referenceId: number | null,
    createdAt: Date,
    updatedAt: Date,
}


export type ChannelDataType = {
    id: number,
    name: string,
    tagName: string,
    des: string,
    accountId: number,
    createdAt: Date,
    updatedAt: Date,
    sub: number
}


export type VideoDataType = {
    id: number,
    title: string,
    des: string,
    view: number,
    status: number,
    link: string,
    channelId: number,
    createdAt: Date,
    updatedAt: Date,
    like: number,
    comment: number
}

export type SessionDataType = {
    user: {
        id: number,
        email: string,
        name: string,
        username: string,
        createdAt: Date,
        updatedAt: Date,
        accessToken: string,
        sub: '2',
        iat: number,
        exp: number,
        jti: string
    }
}

export type SubcribeType = {
    accountId: number,
    channelId: number,
    createdAt: Date,
    updatedAt: Date
}