import { langConfig, translations, httpCodes } from "../../commonIncludes";
import { use, mongo, authorizer } from "@octopy/serverless-core";
import { parkingSchema } from "../../schemas/parking";

const catalogueParking = async(event, context) => {
    const { collections: [parkingModel] } = event.useMongo;
    const parking = parkingModel.find().select("_id name")

    return parking
}

export const handler = use(catalogueParking, { httpCodes, langConfig, translations })
    .use(authorizer({
        uriDB: process.env.MONGO_CONNECTION, secretKey: process.env.SECRET_KEY,
        roles: ["admin", "user"]
    }))
    .use(mongo({ 
        uri: process.env.MONGO_CONNECTION, 
        models: ["parkings"],
        schemas: {
            parkings: parkingSchema
        } 
    }))