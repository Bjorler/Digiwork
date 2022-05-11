import { Schema } from '@octopy/serverless-core'

export const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    last_login: {
        type: Date
    },
    is_admin: {
        type: Boolean,
        default: false,
        required: true
    }
}, {
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at"
    },
    versionKey: false
})