import { langConfig, translations, httpCodes } from "../../commonIncludes";
import { use, mongo, authorizer} from "@octopy/serverless-core";
import { parkingSchema } from "../../schemas/parking";

const listparking = async(event, context) => {
    const { collections: [parkingModel] } = event.useMongo;
    const location_filter = event.queryStringParameters?.location
    const available_filter = event.queryStringParameters?.available ?? "false"

    const name_filter = event.queryStringParameters?.name ?? ""

    const match = {
        name: { $regex: name_filter, $options: "i"},
    }

    if (location_filter) {
        match.location = location_filter
    }

    if (available_filter == "true") {
        match.status = true
    }
   
    const parking = await parkingModel.find(match).populate({path: 'location', select: 'name'})

    return parking
}

export const handler = use(listparking, { httpCodes, langConfig, translations })
    .use(authorizer({
        uriDB: process.env.MONGO_CONNECTION, secretKey: process.env.SECRET_KEY,
        roles: ["admin", "user"]
    }))
    .use(mongo({ 
        uri: process.env.MONGO_CONNECTION, 
        models: ["parkings", "location"],
        schemas: {
            parkings: parkingSchema
        } 
    }))