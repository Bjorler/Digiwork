import { langConfig, translations, httpCodes } from "../../commonIncludes";
import { use, mongo, validateBody, authorizer } from "@octopy/serverless-core";
import { locationSchema } from '../../schemas/location';
import { createLocationDTO } from "../../models/location/createLocationDTO";


const createLocation = async(event, context) => {
    const { collections: [locationModel] } = event.useMongo;
    const location = await locationModel.create(event.body);

    return location
}

export const handler = use(createLocation, { httpCodes, langConfig, translations })
    .use(authorizer({
        uriDB: process.env.MONGO_CONNECTION, secretKey: process.env.SECRET_KEY,
        roles: ["admin"]
    }))    
    .use(validateBody(createLocationDTO, translations))
    .use(mongo({ 
        uri: process.env.MONGO_CONNECTION, 
        models: ["locations"], 
        schemas: {
            locations: locationSchema
        } 
    }));
