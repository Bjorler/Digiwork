import { langConfig, translations, httpCodes } from "../../commonIncludes";
import { use, mongo, validatePathParams } from "@octopy/serverless-core";

import { locationSchema } from '../../schemas/location';

const deleteLocation = async(event, context) => {
    const { collections: [locationModel] } = event.useMongo;
    const id = event.pathParameters.id;
    const location = await locationModel.findByIdAndDelete(id);

    return location
}

export const handler = use(deleteLocation, { httpCodes, langConfig, translations })
    // .use(validatePathParams(locationDTO,translations))
    .use(mongo({ 
        uri: process.env.MONGO_CONNECTION, 
        models: ["locations"], 
        schemas: {
            locations: locationSchema
        } 
    }));