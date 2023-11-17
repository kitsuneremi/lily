import { Channel } from "diagnostics_channel"

export type BigVideoDataType = {
    videoData: MediaDataType,
    channelData: ChannelDataType,
    commentData: CommentDataType[]
}


export type CommentDataType = {
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
    live: Boolean
}

export type MediaDataType = {
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
    Channels?: ChannelDataType,
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
    videoData: MediaDataType,
    channelData: {
        avatarImage: string,
        id: number,
        name: string,
        tagName: string,
        des: string,
        accountId: 1,
        createdAt: Date,
        updatedAt: Date,
        streamKey: string
    }
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