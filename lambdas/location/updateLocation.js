import { langConfig, translations, httpCodes } from "../../commonIncludes";
import { use, mongo, Model} from "@octopy/serverless-core";


const updateLocation = async(event, context) => {
    const { collections: [locationModel] } = event.useMongo;
    const location = await locationModel.findByIdAndUpdate(id,JSON.parse(event.body))
    return location
}

export const handler = use(updateLocation, { httpCodes, langConfig, translations })
    .use(mongo({ uri: process.env.MONGO_CONNECTION, models: ["location"] }))