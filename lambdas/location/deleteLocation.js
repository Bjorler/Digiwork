import { langConfig, translations, httpCodes } from "../../commonIncludes";
import { use, mongo, authorizer } from "@octopy/serverless-core";
import { locationSchema } from '../../schemas/location';

const deleteLocation = async(event, context) => {
    const { collections: [locationModel] } = event.useMongo;
    const id = event.pathParameters.id;
    const location = await locationModel.findByIdAndDelete(id);

    return location
}

export const handler = use(deleteLocation, { httpCodes, langConfig, translations })
    .use(authorizer({
        uriDB: process.env.MONGO_CONNECTION, secretKey: process.env.SECRET_KEY,
        roles: ["admin"]
    })) 
    .use(mongo({ 
        uri: process.env.MONGO_CONNECTION, 
        models: ["locations"], 
        schemas: {
            locations: locationSchema
        } 
    }));