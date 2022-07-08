import { langConfig, translations, httpCodes } from "../../commonIncludes";
import { use, mongo, validateBody,authorizer } from "@octopy/serverless-core";
import { parkingSchema } from "../../schemas/parking";
import { createParkingDTO } from "../../models/parking/createParkingDTO";

const createparking = async(event, context) => {
    const { collections: [parkingModel] } = event.useMongo;
    return await parkingModel.create(event.body)
}

export const handler = use(createparking, { httpCodes, langConfig, translations })
    .use(authorizer({
        uriDB: process.env.MONGO_CONNECTION, secretKey: process.env.SECRET_KEY,
        roles: ["admin"]
    }))
    .use(validateBody(
        createParkingDTO,
        translations
    ))
    .use(mongo({ 
        uri: process.env.MONGO_CONNECTION, 
        models: ["parkings"],
        schemas: {
            parkings: parkingSchema
        } 
    }))