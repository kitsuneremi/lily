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
    accountImage?: string | null,
}


export type ChannelDataType = {
    id: number,
    name: string,
    tagName: string,
    des: string,
    accountId: number,
    createdAt: Date,
    updatedAt: Date,
    sub?: number,
    avatarImage?: string,
    bannerImage?: string | null,
    streamKey: string
}


export type VideoDataType = {
    id: number,
    title: string,
    des: string,
    view?: number,
    status: number,
    link: string,
    channelId: number,
    createdAt: Date,
    updatedAt: Date,
    like?: number,
    comment?: number,
    thumbnail?: string
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
        sub: number,
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

export type VideoWithoutComment = {
    "videoData": {
        "thumbnail": string,
        "id": number,
        "title": string,
        "des": string,
        "view": number,
        "status": number,
        "link": string,
        "channelId": number,
        "createdAt": Date,
        "updatedAt": Date
    },
    "channelData": {
        "avatarImage": string,
        "id": number,
        "name": string,
        "tagName": string,
        "des": string,
        "accountId": 1,
        "createdAt": Date,
        "updatedAt": Date
    }
}


