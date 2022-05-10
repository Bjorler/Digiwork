import { langConfig, translations, httpCodes } from "../../commonIncludes";
import { use, mongo } from "@octopy/serverless-core";
import { workStationSchema } from "../../schemas/workStation";

const deleteWorkstation = async(event, context) => {
    const { collections: [workStationModel] } = event.useMongo;
    const id = event.pathParameters?.id;
    
    const workstation = workStationModel.findByIdAndDelete(id)

    return workstation
}

export const handler = use(deleteWorkstation, { httpCodes, langConfig, translations })
    .use(mongo({ 
        uri: process.env.MONGO_CONNECTION, 
        models: ["work_stations"],
        schemas: {
            work_stations: workStationSchema
        } 
    }))