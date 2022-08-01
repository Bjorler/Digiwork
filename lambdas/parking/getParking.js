import { langConfig, translations, httpCodes } from "../../commonIncludes";
import { use, mongo, authorizer } from "@octopy/serverless-core";
import { parkingSchema } from "../../schemas/parking";

const getParking = async(event, context) => {
    const { collections: [parkingModel] } = event.useMongo;
    const id = event.pathParameters.id;
    const parking = parkingModel.findById(id)

    return parking
}

export const handler = use(getParking, { httpCodes, langConfig, translations })
    .use(authorizer({
        uriDB: process.env.MONGO_CONNECTION, secretKey: process.env.SECRET_KEY,
        roles: ["admin"]
    }))
    .use(mongo({ 
        uri: process.env.MONGO_CONNECTION, 
        models: ["parkings"],
        schemas: {
            parkings: parkingSchema
        } 
    }))