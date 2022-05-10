import { langConfig, translations, httpCodes } from "../../commonIncludes";
import { use, mongo, validatePathParams } from "@octopy/serverless-core";
import { locationDTO } from "../../models/location/locationDTO";


const getLocation = async(event, context) => {
    const { collections: [locationModel] } = event.useMongo;
    const id = event.pathParameters.id;
    const location = await locationModel.findById(id)

    return location
}

export const handler = use(getLocation, { httpCodes, langConfig, translations })
    .use(validatePathParams(locationDTO,translations))
    .use(mongo({ uri: process.env.MONGO_CONNECTION, models: ["location"] }))