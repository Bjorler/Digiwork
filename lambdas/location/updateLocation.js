import { langConfig, translations, httpCodes } from "../../commonIncludes";
import { use, mongo, validatePathParams, validateBody} from "@octopy/serverless-core";
import { locationSchema } from '../../schemas/location';
import { locationDTO } from "../../models/location/locationDTO";


const updateLocation = async(event, context) => {
    const { collections: [locationModel] } = event.useMongo;
    const id = event.pathParameters.id;
    const location = await locationModel.findByIdAndUpdate(id,JSON.parse(event.body))
    return location
}

export const handler = use(updateLocation, { httpCodes, langConfig, translations })
    .use(validatePathParams,validateBody(locationDTO, translations))
    .use(mongo({ 
        uri: process.env.MONGO_CONNECTION, 
        models: ["locations"], 
        schemas: {
            locations: locationSchema
        } 
    }));