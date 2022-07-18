import { Schema } from '@octopy/serverless-core';

export const notificationSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    message: {
        type: String
    },
    image: {
        type: String
    }
});