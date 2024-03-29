import { Schema } from '@octopy/serverless-core';

export const parkingSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    location: {
        type: Schema.Types.ObjectId,
        ref: "location",
        required: true
    },
    status: {
        type: Boolean,
        default: true
    }
});