import { langConfig, translations, httpCodes } from "../../commonIncludes";
import { use, mongo} from "@octopy/serverless-core";

const listLocation = async(event, context) => {
    const { collections: [locationModel] } = event.useMongo;
    const location = await locationModel.find();

    return location
}

export const handler = use(listLocation, { httpCodes, langConfig, translations })
    .use(mongo({ uri: process.env.MONGO_CONNECTION, models: ["location"] }))