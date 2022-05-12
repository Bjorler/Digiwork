import { Schema } from '@octopy/serverless-core'

export const workStationReservationSchema = new Schema({
    work_station: {
        type: Schema.Types.ObjectId,
        ref: "work_stations",
        required: true
    },
    start_date: {
        type: Date,
        required: true
    },
    end_date: {
        type: Date,
        required: true
    },
    comment: {
        type: String
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    status: {
        type: String
    }
}, {
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at"
    },
    versionKey: false
})

export const roomReservationSchema = new Schema({
    room: {
        type: Schema.Types.ObjectId,
        ref: "rooms",
        required: true
    },
    start_date: {
        type: Date,
        required: true
    },
    end_date: {
        type: Date,
        required: true
    },
    comment: {
        type: String
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    status: {
        type: String
    }
}, {
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at"
    },
    versionKey: false
})