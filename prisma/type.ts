interface Media {
    id: number;
    title: string;
    des: string;
    status: number;
    accountId: number;
    thumbnailLink: string;
    view: number;
    createdTime: Date;
    endTime?: Date | null;
    isLive?: boolean | null;
    mediaType: number;
    link: string;
    updatedAt: Date;
    Comment: Comment[];
    DetailListVideo: DetailListVideo[];
    DetailTags?: DetailTags | null;
    Likes: Likes[];
    Account: Account;
    ViewHistory: ViewHistory[];
}

interface Categories {
    id: number;
    name: string;
}

interface Comment {
    id: number;
    accountId: number;
    content: string;
    status: number;
    referenceId?: number | null;
    createdAt: Date;
    updatedAt: Date;
    mediaId: number;
    account: Account;
    media: Media;
    reference?: Comment | null;
    comments: Comment[];
}

interface ListVideo {
    id: number;
    accountId: number;
    name: string;
    DetailListVideo: DetailListVideo[];
    account: Account;
}

interface DetailListVideo {
    id: number;
    listId: number;
    mediaId: number;
    list: ListVideo;
    media: Media;
}

interface Tags {
    id: number;
    name: string;
    DetailTags?: DetailTags | null;
}

interface DetailTags {
    id: number;
    tagId: number;
    mediaId: number;
    media: Media;
    tag: Tags;
}

interface Likes {
    id: number;
    accountId: number;
    type: number;
    createdAt: Date;
    updatedAt: Date;
    mediaId: number;
    account: Account;
    media: Media;
}

interface Notification {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    content: string;
    accountId: number;
    account: Account;
    NotificationDetail: NotificationDetail[];
}

interface NotificationDetail {
    id: number;
    notificationId: number;
    notification: Notification;
    targetAccount: Account;
    targetAccountId: number;
}

interface Subcribes {
    id: number;
    accountId: number;
    createdAt: Date;
    updatedAt: Date;
    account: Account;
    DetailSubcribe: DetailSubcribe[];
}

interface DetailSubcribe {
    id: number;
    subcribeId: number;
    subcribe: Subcribes;
    subcribedAccountId: number;
    subcribedAccount: Account;
}

interface Posts {
    id: number;
    accountId: number;
    title: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    account: Account;
}

interface Room {
    id: number;
    name: string;
    Member: Member[];
    Message: Message[];
}

interface Member {
    id: number;
    roomId: number;
    accountId: number;
    name: string;
    Account: Account;
    Room: Room;
    Message: Message[];
    createdAt: Date;
    deletedAt?: Date | null;
}

interface Message {
    id: number;
    roomId: number;
    memberId: number;
    content: string;
    createdAt: Date;
    Member: Member;
    Room: Room;
}

interface Account {
    id: number;
    email: string;
    name: string;
    password?: string | null;
    tagName: string;
    username: string;
    description?: string | null;
    avatarLink: string;
    bannerLink: string;
    createdAt: Date;
    updatedAt: Date;
    streamKey: string;
    live: boolean;
    provider: string;
    ListVideo: ListVideo[];
    Media: Media[];
    Posts: Posts[];
    comment: Comment[];
    Likes: Likes[];
    Member: Member[];
    SearchHistory: SearchHistory[];
    ViewHistory: ViewHistory[];
    Notification: Notification[];
    NotificationDetail: NotificationDetail[];
    Subcribes: Subcribes[];
    DetailSubcribe: DetailSubcribe[];
}

interface SearchHistory {
    id: number;
    accountId: number;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    account: Account;
}

interface ViewHistory {
    id: number;
    accountId: number;
    mediaId: number;
    createdAt: Date;
    updatedAt: Date;
    account: Account;
    media: Media;
    mediaProgress: number;
}


export type {Account, Categories, Comment, DetailListVideo, DetailSubcribe, DetailTags, Likes, ListVideo, Media, Member, Message, Notification, NotificationDetail, Posts, Room, SearchHistory, Subcribes, Tags, ViewHistory}