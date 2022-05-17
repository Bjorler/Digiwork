import { langConfig, translations, httpCodes } from "../../commonIncludes";
import { use, mongo, authorizer} from "@octopy/serverless-core";
import { locationSchema } from '../../schemas/location';

const catalogueLocation = async(event, context) => {
    const { collections: [locationModel] } = event.useMongo;
    const location = await locationModel.find().select("_id name")

    return location
}

export const handler = use(catalogueLocation, { httpCodes, langConfig, translations })
    .use(authorizer({
        uriDB: process.env.MONGO_CONNECTION, secretKey: process.env.SECRET_KEY,
        roles: ["admin", "user"]
    }))
    .use(mongo({ 
    uri: process.env.MONGO_CONNECTION, 
    models: ["locations"], 
    schemas: {
        locations: locationSchema
    } 
    }));