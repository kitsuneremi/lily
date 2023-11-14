import mongoose, { Schema, Document } from 'mongoose';

const liveChatSchema: Schema = new Schema({
    accountId: Number,
    name: String,
    image: String,
    content: String,
    room: Number,
    deletedAt: Date
}, {
    timestamps: true
});

const liveChats = mongoose.models.liveChats || mongoose.model('liveChats', liveChatSchema);


export default liveChats;