import { langConfig, translations, httpCodes } from "../../commonIncludes";
import { use, mongo, Model, validateBody, token, authorizer } from "@octopy/serverless-core";
import { workStationReservationSchema, roomReservationSchema } from "../../schemas/reservation"
import { createReservationDTO } from "../../models/reservation/createReservationDTO"
import { ReservationEnum, ReservationStatus } from "../../helpers/shared/enums";

const createReservation = async (event, context) => {
    const { collections: [wsReservationModel, roomReservationModel] } = event.useMongo;
    const { payload } = event.useToken;
    const { reservation_type } = event.body;
    
    const data = { 
        ...event.body, 
        user_id: payload?._id, 
        status: ReservationStatus.approved,
        check_in: false
    }
    
    delete data.reservation_type;
    delete data.id_name;
    
    if (reservation_type === ReservationEnum.work_station) {
        data.work_station = event.body.id_name;
    } else {
        data.room = event.body.id_name;
    }

    const reservation = await Model(reservation_type === ReservationEnum.work_station
        ? wsReservationModel
        : roomReservationModel
    ).create(data)

    return reservation;
}

export const handler = use(createReservation, { httpCodes, langConfig, translations })
    .use(authorizer({
        uriDB: process.env.MONGO_CONNECTION, secretKey: process.env.SECRET_KEY,
        roles: ["admin", "user"]
    }))
    .use(validateBody(createReservationDTO, translations))
    .use(mongo({
        uri: process.env.MONGO_CONNECTION,
        models: ["work_station_reservations", "room_reservations"],
        schemas: {
            work_station_reservations: workStationReservationSchema,
            room_reservations: roomReservationSchema
        }
    }))
    .use(token(process.env.SECRET_KEY))