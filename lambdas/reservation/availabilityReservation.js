import { langConfig, translations, httpCodes } from "../../commonIncludes";
import { use, mongo, authorizer, validateBody, mongooseTypes } from "@octopy/serverless-core";
import { availabilityReservationDTO } from "../../models/reservation/availabilityReservationDTO";
import { workStationReservationSchema, roomReservationSchema } from "../../schemas/reservation"
import { ReservationEnum } from "../../helpers/shared/enums";

const availabilityReservation = async (event, context) => {
    const { collections: [wsReservationModel, roomReservationModel] } = event.useMongo;
    const { reservation_type, end_date, start_date, id_name } = event.body;
    let available;
    let reservations;
    const parse_start_date = new Date(start_date).toISOString();
    const parse_end_date = new Date(end_date).toISOString();

    const dateMatch = {
        $or: [
            {
                start_date: { $lt: parse_start_date },
                end_date: { $gt: parse_end_date }
            },
            {
                start_date: { $lt: parse_end_date },
                end_date: { $gt: parse_start_date }
            },
        ]
    }

    if(reservation_type === ReservationEnum.work_station) {
        reservations = await wsReservationModel.find({
            work_station: mongooseTypes.ObjectId(id_name),
            ...dateMatch
        })
    } else {
        reservations = await roomReservationModel.find({
            room: mongooseTypes.ObjectId(id_name),
            ...dateMatch
        })
    }

    available = (reservations.length >= 1) ? false : true;

    return { available };
}

export const handler = use(availabilityReservation, { httpCodes, langConfig, translations })
    .use(authorizer({
        uriDB: process.env.MONGO_CONNECTION, secretKey: process.env.SECRET_KEY,
        roles: ["admin", "user"]
    }))
    .use(validateBody(availabilityReservationDTO, translations))
    .use(mongo({
        uri: process.env.MONGO_CONNECTION,
        models: ["work_station_reservations", "room_reservations"],
        schemas: {
            work_station_reservations: workStationReservationSchema,
            room_reservations: roomReservationSchema
        }
    }))