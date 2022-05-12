import { langConfig, translations, httpCodes } from "../../commonIncludes";
import { use, mongo, Model, authorizer, validateQueryParams } from "@octopy/serverless-core";
import { filterNameDTO } from "../../models/shared/filtersDTO";
import { workStationReservationSchema, roomReservationSchema } from "../../schemas/reservation";
import { workStationSchema } from "../../schemas/workStation";
import { userSchema } from "../../schemas/user";
import { roomSchema } from "../../schemas/room"

const listReservation = async (event, context) => {
    const { collections: [wsReservationModel, roomReservationModel] } = event.useMongo;
    
    const work_stations = await wsReservationModel
        .find()
        .populate('work_station', { name: 1, _id: 0 })
        .populate('user_id', { name: 1, _id: 0 })

    const rooms = await roomReservationModel
        .find()
        .populate('room', { name: 1, _id: 0 })
        .populate('user_id', { name: 1, _id: 0 })
    return [...work_stations, ...rooms];
}

export const handler = use(listReservation, { httpCodes, langConfig, translations })
    .use(authorizer({
        uriDB: process.env.MONGO_CONNECTION, secretKey: process.env.SECRET_KEY,
        roles: ["admin"]
    }))
    .use(validateQueryParams(filterNameDTO, translations, { applyAutoparser: false }))
    .use(mongo({
        uri: process.env.MONGO_CONNECTION,
        models: ["work_station_reservations", "room_reservations", "work_stations", "rooms", "users"],
        schemas: {
            work_station_reservations: workStationReservationSchema,
            room_reservations: roomReservationSchema,
            work_stations: workStationSchema,
            rooms: roomSchema,
            users: userSchema
        }
    }))