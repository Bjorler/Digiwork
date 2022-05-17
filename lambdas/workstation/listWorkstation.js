import { langConfig, translations, httpCodes } from "../../commonIncludes";
import { use, mongo, authorizer} from "@octopy/serverless-core";
import { workStationSchema } from "../../schemas/workStation";

const listWorkstation = async(event, context) => {
    const { collections: [workStationModel] } = event.useMongo;
    const location_filter = event.queryStringParameters?.location
    const available_filter = event.queryStringParameters?.available ?? "false"
    console.log(available_filter);
    const name_filter = event.queryStringParameters?.name ?? ""

    const match = {
        name: { $regex: name_filter, $options: "i"},
    }

    if (location_filter) {
        match.location = location_filter
    }

    if (available_filter == "true") {
        match.status = true
    }
    console.log(match);
    const workstation = await workStationModel.find(match)

    return workstation
}

export const handler = use(listWorkstation, { httpCodes, langConfig, translations })
    .use(authorizer({
        uriDB: process.env.MONGO_CONNECTION, secretKey: process.env.SECRET_KEY,
        roles: ["admin", "user"]
    }))
    .use(mongo({ 
        uri: process.env.MONGO_CONNECTION, 
        models: ["work_stations"],
        schemas: {
            work_stations: workStationSchema
        } 
    }))