import { langConfig, translations, httpCodes } from "../../commonIncludes";
import { use, mongo, Model, token, authorizer, mongooseTypes, dayjs, validateBody } from "@octopy/serverless-core";
import { workStationReservationSchema, roomReservationSchema } from "../../schemas/reservation";
import { ReservationEnum } from "../../helpers/shared/enums";
import { getReservationDTO } from "../../models/reservation/getReservationDTO";

const checkInReservation = async (event, context) => {
    const { collections: [wsReservationModel, roomModel] } = event.useMongo;
    const { payload } = event.useToken;
    const { id } = event.pathParameters;
    const { reservation_type } = event.body;
    const current_date = dayjs().$d;

    const collection = reservation_type === ReservationEnum.work_station ? wsReservationModel : roomModel;

    const reservation = await collection.findOneAndUpdate({
        _id: id,
        user_id: mongooseTypes.ObjectId(payload._id),
        start_date: { $lte: current_date }
    }, {
        check_in: true
    })

    if (!reservation) {
        throw { scode: "notCheckIn" }
    }

    return {}
}

export const handler = use(checkInReservation, { httpCodes, langConfig, translations })
    .use(authorizer({
        uriDB: process.env.MONGO_CONNECTION, secretKey: process.env.SECRET_KEY,
        roles: ["admin", "user"]
    }))
    .use(validateBody(getReservationDTO, translations))
    .use(mongo({
        uri: process.env.MONGO_CONNECTION,
        models: ["work_station_reservations", "room_reservations"],
        schemas: {
            work_station_reservations: workStationReservationSchema,
            room_reservations: roomReservationSchema,
        }
    }))
    .use(token(process.env.SECRET_KEY))