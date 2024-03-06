export type Comment = {
    id: number,
    mediaId: number,
    accountId: number,
    content: string,
    status: number,
    referenceId: number | null,
    createdAt: Date,
    updatedAt: Date,
    accountImage?: string | null,
}

export type Account = {
    id: number,
    name: string,
    tagName: string,
    des: string,
    avatarImage: string,
    bannerImage: string,
    streamKey: string
    live: Boolean
    createdAt: Date,
    updatedAt: Date,
}

export type Media = {
    id: number,
    title: string,
    des: string,
    view?: number,
    status: number,
    link: string,
    isLive: boolean | null,
    mediaType: number,
    channelId: number,
    createdTime: Date,
    updatedAt: Date,
    like?: number,
    comment?: number,
    thumbnail?: string,
    Account?: Account,
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

export type LiveData = {
    id: number;
    title: string | null;
    des: string | null;
    status: number;
    channelId: number | null;
    view: number;
    startTime: Date;
    endTime: Date;
    isLive: boolean;
}