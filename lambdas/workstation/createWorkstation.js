import { langConfig, translations, httpCodes } from "../../commonIncludes";
import { use, mongo } from "@octopy/serverless-core";
import { workStationSchema } from "../../schemas/workStation";

const createWorkstation = async(event, context) => {
    const { collections: [workStationModel] } = event.useMongo;
    return await workStationModel.create(JSON.parse(event.body))
}

export const handler = use(createWorkstation, { httpCodes, langConfig, translations })
    .use(mongo({ 
        uri: process.env.MONGO_CONNECTION, 
        models: ["work_stations"],
        schemas: {
            work_stations: workStationSchema
        } 
    }))