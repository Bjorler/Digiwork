import { langConfig, translations, httpCodes } from "../../commonIncludes";
import { use, mongo, Model, authorizer, validatePathParams } from "@octopy/serverless-core";
import { getReservationDTO } from "../../models/reservation/getReservationDTO";
import { ReservationEnum } from "../../helpers/shared/enums";
import { workStationReservationSchema, roomReservationSchema } from "../../schemas/reservation"
import { workStationSchema } from "../../schemas/workStation";
import { userSchema } from "../../schemas/user";
import { roomSchema } from "../../schemas/room"

const getReservation = async (event, context) => {
    const { collections: [wsReservationModel, roomReservationModel] } = event.useMongo;
    const { id, reservation_type } = event.pathParameters;
    let reservation;

    if (reservation_type === ReservationEnum.work_station) {
        reservation = await wsReservationModel
            .find({ _id: id })
            .populate('work_station', { name: 1, _id: 0 })
            .populate('user_id', { name: 1, _id: 0 })
    } else {
        reservation = await roomReservationModel
            .find({ _id: id })
            .populate('room', { name: 1, _id: 0 })
            .populate('user_id', { name: 1, _id: 0 })
    }

    if (!reservation[0]) {
        throw { scode: "reservationNotFound" }
    }

    return reservation[0];
}

export const handler = use(getReservation, { httpCodes, langConfig, translations })
    .use(authorizer({
        uriDB: process.env.MONGO_CONNECTION, secretKey: process.env.SECRET_KEY,
        roles: ["admin"]
    }))
    .use(validatePathParams(getReservationDTO, translations))
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