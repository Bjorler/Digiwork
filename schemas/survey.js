import { Schema } from '@octopy/serverless-core';

export const surveySchema = new Schema({
    title: {
        type: String,
        required: true
    },
    question: {
        type: String,
        required: true
    },
    answer: {
        type: Boolean,
        required: true
    }
});