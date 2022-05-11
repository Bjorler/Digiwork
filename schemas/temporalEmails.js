import { Schema } from '@octopy/serverless-core'

export const temporalEmailSchema = new Schema({
    expiration_date: { 
        type: Date, 
        expires: 0 
    }
}, {
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at"
    },
    versionKey: false,
    strict: false
})