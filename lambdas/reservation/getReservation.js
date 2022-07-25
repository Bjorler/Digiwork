import { langConfig, translations, httpCodes } from "../../commonIncludes";
import { use, mongo, authorizer, validatePathParams, validateQueryParams } from "@octopy/serverless-core";
import { getReservationDTO } from "../../models/reservation/getReservationDTO";
import { mongoIdDTO } from "../../models/shared/mongoIdDTO";
import { ReservationEnum } from "../../helpers/shared/enums";
import { workStationReservationSchema, roomReservationSchema, parkingReservationSchema } from "../../schemas/reservation"
import { workStationSchema } from "../../schemas/workStation";
import { userSchema } from "../../schemas/user";
import { roomSchema } from "../../schemas/room";
import { parkingSchema } from "../../schemas/parking";

const getReservation = async (event, context) => {
    const { collections: [wsReservationModel, roomReservationModel, 
            parkingReservationModel] } = event.useMongo;
    const { id } = event.pathParameters;
    const { type } = event.queryStringParameters;
    let reservation;

    if (type === ReservationEnum.work_station) {
        reservation = await wsReservationModel
            .findById(id)
            .populate('work_station', { name: 1, _id: 0 })
            .populate('user_id', { name: 1, _id: 0 })
    } else if (type === ReservationEnum.room) {
        reservation = await roomReservationModel
            .findById(id)
            .populate('room', { name: 1, _id: 0 })
            .populate('user_id', { name: 1, _id: 0 })
    } else {
        reservation = await parkingReservationModel
            .findById(id)
            .populate('parking', { name: 1, _id: 0 })
            .populate('user_id', { name: 1, _id: 0 })
    }

    if (!reservation) {
        throw { scode: "reservationNotFound" }
    }

    return reservation;
}

export const handler = use(getReservation, { httpCodes, langConfig, translations })
    .use(authorizer({
        uriDB: process.env.MONGO_CONNECTION, secretKey: process.env.SECRET_KEY,
        roles: ["admin"]
    }))
    .use(validatePathParams(mongoIdDTO, translations))
    .use(validateQueryParams(getReservationDTO, translations))
    .use(mongo({
        uri: process.env.MONGO_CONNECTION,
        models: ["work_station_reservations", "room_reservations",
                 "parking_reservations","work_stations", "rooms", "users", "parkings", ],
        schemas: {
            work_station_reservations: workStationReservationSchema,
            room_reservations: roomReservationSchema,
            parking_reservations: parkingReservationSchema,
            work_stations: workStationSchema,
            rooms: roomSchema,
            users: userSchema,
            parkings: parkingSchema
        }
    }))