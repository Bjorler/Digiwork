import { langConfig, translations, httpCodes } from "../../commonIncludes";
import { use, mongo } from "@octopy/serverless-core";
import { workStationSchema } from "../../schemas/workStation";

const listWorkstation = async(event, context) => {
    const { collections: [workStationModel] } = event.useMongo;
    const location_filter = event.queryStringParameters?.location
    const name_filter = event.queryStringParameters?.name ?? ""

    const match = {
        name: { $regex: name_filter, $options: "i"},
    }

    if (location_filter) {
        match.location = location_filter
    }
    
    const workstation = await workStationModel.find(match)

    return workstation
}

export const handler = use(listWorkstation, { httpCodes, langConfig, translations })
    .use(mongo({ 
        uri: process.env.MONGO_CONNECTION, 
        models: ["work_stations"],
        schemas: {
            work_stations: workStationSchema
        } 
    }))