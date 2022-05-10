import { langConfig, translations, httpCodes } from "../../commonIncludes";
import { use, mongo } from "@octopy/serverless-core";
import { workStationSchema } from "../../schemas/workStation";

const listWorkstation = async(event, context) => {
    const { collections: [workStationModel] } = event.useMongo;
    const workstation = workStationModel.find()

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