import { Schema } from "mongoose";


const locationSchema = Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    }
})

export const locationModel = mongoose.models.location || mongoose.model('location',locationSchema)