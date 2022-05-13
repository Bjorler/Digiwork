import { langConfig, translations, httpCodes } from "../../commonIncludes";
import { use, mongo, Model, authorizer, validatePathParams, validateQueryParams } from "@octopy/serverless-core";
import { workStationReservationSchema, roomReservationSchema } from "../../schemas/reservation";
import { getReservationDTO } from "../../models/reservation/getReservationDTO";
import { ReservationEnum, ReservationStatus } from "../../helpers/shared/enums";
import { mongoIdDTO } from "../../models/shared/mongoIdDTO";

const cancelReservation = async (event, context) => {
    const { collections: [wsReservationModel, roomReservationModel] } = event.useMongo;
    const { id } = event.pathParameters;
    const { type } = event.queryStringParameters;

    const reservation = await Model(type === ReservationEnum.work_station
        ? wsReservationModel
        : roomReservationModel
    ).updateById(id, { status: ReservationStatus.cancelled })

    if (!reservation) {
        throw { scode: "cancellReservationError" }
    }

    return reservation;
}

export const handler = use(cancelReservation, { httpCodes, langConfig, translations })
    .use(authorizer({
        uriDB: process.env.MONGO_CONNECTION, secretKey: process.env.SECRET_KEY,
        roles: ["admin"]
    }))
    .use(validatePathParams(mongoIdDTO, translations))
    .use(validateQueryParams(getReservationDTO, translations))
    .use(mongo({
        uri: process.env.MONGO_CONNECTION,
        models: ["work_station_reservations", "room_reservations"],
        schemas: {
            work_station_reservations: workStationReservationSchema,
            room_reservations: roomReservationSchema
        }
    }))