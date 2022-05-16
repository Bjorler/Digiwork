import { langConfig, translations, httpCodes } from "../../commonIncludes";
import { use, mongo, authorizer, mongooseTypes } from "@octopy/serverless-core";
import { roomReservationSchema } from "../../schemas/reservation"

const reservationsRoom = async (event, context) => {
    const { collections: [roomReservationModel] } = event.useMongo;
    const { id } = event.pathParameters;
    const count = await roomReservationModel.find({
        room: mongooseTypes.ObjectId(id)
    }).count();

    return { reservation_related: count }
}

export const handler = use(reservationsRoom, { httpCodes, langConfig, translations })
    .use(authorizer({
        uriDB: process.env.MONGO_CONNECTION, secretKey: process.env.SECRET_KEY,
        roles: ["admin"]
    }))
    .use(mongo({
        uri: process.env.MONGO_CONNECTION,
        models: ["room_reservations"],
        schemas: {
            work_station_reservations: roomReservationSchema
        }
    }))