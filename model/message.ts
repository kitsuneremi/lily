import mongoose, { Schema, Document } from 'mongoose';

const messageSchema: Schema = new Schema({
    memberId: Number,
    roomId: String,
    file: String,
    content: String,
    createdAt: Date,
    deletedAt: Date
}, {
    timestamps: true
});

const message = mongoose.models.message || mongoose.model('message', messageSchema);


export default message;