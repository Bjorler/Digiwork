import { langConfig, translations, httpCodes } from "../../commonIncludes";
import { use, mongo, authorizer, validateBody} from "@octopy/serverless-core";
import { locationSchema } from '../../schemas/location';
import { updateLocationDTO } from "../../models/location/updateLocationDTO";


const updateLocation = async(event, context) => {
    const { collections: [locationModel] } = event.useMongo;
    const id = event.pathParameters?.id;
    const body = event.body
    const location = await locationModel.findByIdAndUpdate(id,body)
    return location
}

export const handler = use(updateLocation, { httpCodes, langConfig, translations })
    .use(authorizer({
        uriDB: process.env.MONGO_CONNECTION, secretKey: process.env.SECRET_KEY,
        roles: ["admin"]
    })) 
    .use(validateBody(updateLocationDTO, translations))
    .use(mongo({ 
        uri: process.env.MONGO_CONNECTION, 
        models: ["locations"], 
        schemas: {
            locations: locationSchema
        } 
    }));