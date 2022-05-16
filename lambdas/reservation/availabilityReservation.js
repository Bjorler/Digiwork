import { langConfig, translations, httpCodes } from "../../commonIncludes";
import { use, mongo, Model, authorizer, validateBody, mongooseTypes, dayjs } from "@octopy/serverless-core";
import { availabilityReservationDTO } from "../../models/reservation/availabilityReservationDTO";
import { workStationReservationSchema, roomReservationSchema } from "../../schemas/reservation"
import { ReservationEnum } from "../../helpers/shared/enums";

const availabilityReservation = async (event, context) => {
    const { collections: [wsReservationModel, roomReservationModel] } = event.useMongo;
    const { reservation_type, end_date, start_date, id_name } = event.body;
    let available;
    let reservations;

    const dateMatch = {
        $or: [
            {
                start_date: { $lte: dayjs(start_date).$d },
                end_date: { $gte: dayjs(end_date).$d }
            },
            {
                start_date: { $lte: dayjs(end_date).$d },
                end_date: { $gte: dayjs(start_date).$d }
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