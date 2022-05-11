import { langConfig, translations, httpCodes } from "../../commonIncludes";
import { use, mongo, validateBody, authorizer} from "@octopy/serverless-core";
import { workStationSchema } from "../../schemas/workStation";
import { updateWorkstationDTO } from "../../models/workstation/updateWorkstation";

const updateWorkstation = async(event, context) => {
    const { collections: [workStationModel] } = event.useMongo;
    const id = event.pathParameters.id;
    const Body = event.body
    const workstation = await workStationModel.findByIdAndUpdate(id,Body)

    return workstation
}

export const handler = use(updateWorkstation, { httpCodes, langConfig, translations })
    .use(authorizer({
        uriDB: process.env.MONGO_CONNECTION, secretKey: process.env.SECRET_KEY,
        roles: ["admin"]
    }))
    .use(validateBody(
        updateWorkstationDTO,
        translations
    ))
    .use(mongo({ 
        uri: process.env.MONGO_CONNECTION, 
        models: ["work_stations"],
        schemas: {
            work_stations: workStationSchema
        } 
    }))