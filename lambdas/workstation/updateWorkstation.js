import { langConfig, translations, httpCodes } from "../../commonIncludes";
import { use, mongo } from "@octopy/serverless-core";
import { workStationSchema } from "../../schemas/workStation";

const updateWorkstation = async(event, context) => {
    const { collections: [workStationModel] } = event.useMongo;
    const id = event.pathParameters.id;
    const Body = JSON.parse(event.body)
    const workstation = await workStationModel.findByIdAndUpdate(id,Body)

    return workstation
}

export const handler = use(updateWorkstation, { httpCodes, langConfig, translations })
    .use(mongo({ 
        uri: process.env.MONGO_CONNECTION, 
        models: ["work_stations"],
        schemas: {
            work_stations: workStationSchema
        } 
    }))