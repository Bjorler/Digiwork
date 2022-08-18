import { langConfig, translations, httpCodes } from "../../commonIncludes";
import { use, mongo, Model, token, authorizer, mongooseTypes, dayjs, validateBody } from "@octopy/serverless-core";
import { workStationReservationSchema, roomReservationSchema, parkingReservationSchema } from "../../schemas/reservation";
import { ReservationEnum } from "../../helpers/shared/enums";
import { getReservationDTO } from "../../models/reservation/getReservationDTO";

const checkInReservation = async (event, context) => {
    const { collections: [wsReservationModel, roomReservationModel, parkingReservationModel] } = event.useMongo;
    const { payload } = event.useToken;
    const { id } = event.pathParameters;
    const { type } = event.body;
    const current_date = dayjs().$d;

    let modelo;
    switch (type) {
        case ReservationEnum.work_station:
            modelo = wsReservationModel
            break;
        case ReservationEnum.room:
            modelo = roomReservationModel
            break;
        case ReservationEnum.parking:
            console.log('cualquiera');
            modelo = parkingReservationModel
            break;
    }

    const reservation = await modelo.findOneAndUpdate({
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
        models: ["work_station_reservations", "room_reservations", "parking_reservations"],
        schemas: {
            work_station_reservations: workStationReservationSchema,
            room_reservations: roomReservationSchema,
            parking_reservations: parkingReservationSchema
        }
    }))
    .use(token(process.env.SECRET_KEY))