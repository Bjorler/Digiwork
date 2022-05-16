import { langConfig, translations, httpCodes } from "../../commonIncludes";
import { use, mongo, authorizer, mongooseTypes } from "@octopy/serverless-core";
import { workStationReservationSchema } from "../../schemas/reservation"

const reservationsWorkstation = async (event, context) => {
    const { collections: [wsReservationModel] } = event.useMongo;
    const { id } = event.pathParameters;
    const count = await wsReservationModel.find({
        work_station: mongooseTypes.ObjectId(id)
    }).count();

    return { reservation_related: count }
}

export const handler = use(reservationsWorkstation, { httpCodes, langConfig, translations })
    .use(authorizer({
        uriDB: process.env.MONGO_CONNECTION, secretKey: process.env.SECRET_KEY,
        roles: ["admin"]
    }))
    .use(mongo({
        uri: process.env.MONGO_CONNECTION,
        models: ["work_station_reservations"],
        schemas: {
            work_station_reservations: workStationReservationSchema
        }
    }))