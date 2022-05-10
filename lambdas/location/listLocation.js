import { langConfig, translations, httpCodes } from "../../commonIncludes";
import { use, mongo} from "@octopy/serverless-core";
import { locationSchema } from '../../schemas/location';

const listLocation = async(event, context) => {
    const { collections: [locationModel] } = event.useMongo;
    const name_filter = event.queryStringParameters?.name ?? ""
    const location = await locationModel.find({
        name: { $regex: name_filter, $options: "i"}
    });

    return location
}

export const handler = use(listLocation, { httpCodes, langConfig, translations })
.use(mongo({ 
    uri: process.env.MONGO_CONNECTION, 
    models: ["locations"], 
    schemas: {
        locations: locationSchema
    } 
}));