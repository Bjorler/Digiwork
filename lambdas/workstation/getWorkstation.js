import { langConfig, translations, httpCodes } from "../../commonIncludes";
import { use, mongo, authorizer } from "@octopy/serverless-core";
import { workStationSchema } from "../../schemas/workStation";

const getWorkstation = async(event, context) => {
    const { collections: [workStationModel] } = event.useMongo;
    const id = event.pathParameters.id;
    const workstation = workStationModel.findById(id)

    return workstation
}

export const handler = use(getWorkstation, { httpCodes, langConfig, translations })
    .use(authorizer({
        uriDB: process.env.MONGO_CONNECTION, secretKey: process.env.SECRET_KEY,
        roles: ["admin"]
    }))
    .use(mongo({ 
        uri: process.env.MONGO_CONNECTION, 
        models: ["work_stations"],
        schemas: {
            work_stations: workStationSchema
        } 
    }))