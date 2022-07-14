import { langConfig, translations, httpCodes } from "../../commonIncludes";
import { use, mongo, authorizer, mongooseTypes} from "@octopy/serverless-core";
import { parkingSchema } from "../../schemas/parking";
import { parkingReservationSchema } from "../../schemas/reservation"

const deleteparking = async(event, context) => {
    const { collections: [parkingModel, pReservationModel] } = event.useMongo;
    const id = event.pathParameters?.id;

    await pReservationModel.deleteMany({
        parking: mongooseTypes.ObjectId(id)
    });
    
    const parking = parkingModel.findByIdAndDelete(id)

    return parking
}

export const handler = use(deleteparking, { httpCodes, langConfig, translations })
    .use(authorizer({
        uriDB: process.env.MONGO_CONNECTION, secretKey: process.env.SECRET_KEY,
        roles: ["admin"]
    }))
    .use(mongo({ 
        uri: process.env.MONGO_CONNECTION, 
        models: ["parkings","parking_reservations"],
        schemas: {
            parkings: parkingSchema,
            parking_reservations: parkingReservationSchema
        } 
    }))