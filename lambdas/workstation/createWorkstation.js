import { langConfig, translations, httpCodes } from "../../commonIncludes";
import { use, mongo, validateBody,authorizer } from "@octopy/serverless-core";
import { workStationSchema } from "../../schemas/workStation";
import { createWorkstationDTO } from "../../models/workstation/createWorkstationDTO";

const createWorkstation = async(event, context) => {
    const { collections: [workStationModel] } = event.useMongo;
    return await workStationModel.create(event.body)
}

export const handler = use(createWorkstation, { httpCodes, langConfig, translations })
    .use(authorizer({
        uriDB: process.env.MONGO_CONNECTION, secretKey: process.env.SECRET_KEY,
        roles: ["admin"]
    }))
    .use(validateBody(
        createWorkstationDTO,
        translations
    ))
    .use(mongo({ 
        uri: process.env.MONGO_CONNECTION, 
        models: ["work_stations"],
        schemas: {
            work_stations: workStationSchema
        } 
    }))