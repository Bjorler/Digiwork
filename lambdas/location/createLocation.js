import { langConfig, translations, httpCodes } from "../../commonIncludes";
import { use, mongo} from "@octopy/serverless-core";
import { locationSchema } from '../../schemas/location';

const createLocation = async(event, context) => {
    const { collections: [locationModel] } = event.useMongo;
    const location = await locationModel.create(JSON.parse(event.body));

    return location
}

export const handler = use(createLocation, { httpCodes, langConfig, translations })
    .use(mongo({ 
        uri: process.env.MONGO_CONNECTION, 
        models: ["locations"], 
        schemas: {
            locations: locationSchema
        } 
    }));
