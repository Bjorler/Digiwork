import { langConfig, translations, httpCodes } from "../../commonIncludes";
import { use, mongo, Model, validateBody, token, authorizer } from "@octopy/serverless-core";
import { workStationReservationSchema, roomReservationSchema } from "../../schemas/reservation"
import { createReservationDTO } from "../../models/reservation/createReservationDTO"
import { ReservationEnum } from "../../helpers/shared/enums";

const createReservation = async (event, context) => {
    const { collections: [workStationReservationModel, roomReservationModel] } = event.useMongo;
    const { payload } = event.useToken;
    const { reservation_type } = event.body;
    event.body.user_id = payload?._id;
    let reservation;

    switch (reservation_type) {
        case ReservationEnum.work_station:
            event.body.work_station = event.body.id_name;
            delete event.body.reservation_type;
            delete event.body.id_name;
            
            reservation = await Model(workStationReservationModel).create(event.body);
            break;

        case ReservationEnum.room:
            event.body.room = event.body.id_name;
            delete event.body.reservation_type;
            delete event.body.id_name;
            
            reservation = await Model(roomReservationModel).create(event.body)
            break;

        default:
            break;
    }
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