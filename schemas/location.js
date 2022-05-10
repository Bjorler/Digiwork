import { Schema } from '@octopy/serverless-core';

export const locationSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    }
});