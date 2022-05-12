import { Schema } from '@octopy/serverless-core';

export const roomSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    location: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "location"
    },
    spaces: {
        type: Number,
        required: true,
        default: 0
    },
    amenities: {
        type:String,
        required: true
    },
    status: {
        type: Boolean,
        default: true
    }
});