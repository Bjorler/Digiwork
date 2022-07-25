import { langConfig, translations, httpCodes } from "../../commonIncludes";
import { use, mongo, Model, authorizer, validatePathParams, validateBody } from "@octopy/serverless-core";
import { workStationReservationSchema, roomReservationSchema, parkingReservationSchema } from "../../schemas/reservation";
import { getReservationDTO } from "../../models/reservation/getReservationDTO";
import { ReservationEnum, ReservationStatus } from "../../helpers/shared/enums";
import { mongoIdDTO } from "../../models/shared/mongoIdDTO";

const cancelReservation = async (event, context) => {
    const { collections: [wsReservationModel, roomReservationModel, parkingReservationModel] } = event.useMongo;
    const { id } = event.pathParameters;
    const { type } = event.body;

    // const reservation = await Model(reservation_type === ReservationEnum.work_station
    //     ? wsReservationModel 
    //     : ReservationEnum.room ? roomReservationModel
    //     : parkingReservationModel

        let modelo;
    switch (type) {
        case ReservationEnum.work_station:
            modelo = wsReservationModel
            break;
        case ReservationEnum.room:
            modelo = roomReservationModel
            break;
        case ReservationEnum.parking:
            modelo = parkingReservationModel
            break;
        default: throw { scode: 'cancellReservationError'};
    }
    // ).updateById(id, { status: ReservationStatus.cancelled })

    // if (!reservation) {
    //     throw { scode: "cancellReservationError" }
    // }

    const reservation = await Model(modelo).updateById(id, { status: ReservationStatus.cancelled })

    return reservation;
}

export const handler = use(cancelReservation, { httpCodes, langConfig, translations })
    .use(authorizer({
        uriDB: process.env.MONGO_CONNECTION, secretKey: process.env.SECRET_KEY,
        roles: ["admin"]
    }))
    .use(validatePathParams(mongoIdDTO, translations))
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