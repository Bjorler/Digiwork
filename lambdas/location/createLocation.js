import { langConfig, translations, httpCodes } from "../../commonIncludes";
import { use, mongo, validateBody } from "@octopy/serverless-core";
import { locationSchema } from '../../schemas/location';
import { locationDTO } from "../../models/location/locationDTO";


const createLocation = async(event, context) => {
    const { collections: [locationModel] } = event.useMongo;
    const body = JSON.parse(event.body);
    const location = await locationModel.create(body);

    return location
}

export const handler = use(createLocation, { httpCodes, langConfig, translations })
    .use(validateBody(locationDTO, translations))
    .use(mongo({ 
        uri: process.env.MONGO_CONNECTION, 
        models: ["locations"], 
        schemas: {
            locations: locationSchema
        } 
    }));
