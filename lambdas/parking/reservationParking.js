import { langConfig, translations, httpCodes } from "../../commonIncludes";
import { use, mongo, authorizer, mongooseTypes } from "@octopy/serverless-core";
import { parkingReservationSchema } from "../../schemas/reservation"

const reservationsparking = async (event, context) => {
    const { collections: [pReservationModel] } = event.useMongo;
    const { id } = event.pathParameters;
    const count = await pReservationModel.find({
        parking: mongooseTypes.ObjectId(id)
    }).count();

    return { reservation_related: count }
}

export const handler = use(reservationsparking, { httpCodes, langConfig, translations })
    .use(authorizer({
        uriDB: process.env.MONGO_CONNECTION, secretKey: process.env.SECRET_KEY,
        roles: ["admin"]
    }))
    .use(mongo({
        uri: process.env.MONGO_CONNECTION,
        models: ["parking_reservations"],
        schemas: {
            parking_reservations: parkingReservationSchema
        }
    }))