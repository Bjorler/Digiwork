import { Schema } from '@octopy/serverless-core';

export const workStationSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    location: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "location"
    }
});