import mongoose, { Schema, Document } from 'mongoose';

const likesSchema: Schema = new Schema({
    id: Number,
    videoId: Number,
    accountId: Number,
    type: Number,
}, {
    timestamps: true
});

const Likes = mongoose.models.Likes || mongoose.model('Likes', likesSchema);


export default Likes;