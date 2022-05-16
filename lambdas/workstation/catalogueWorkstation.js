import { langConfig, translations, httpCodes } from "../../commonIncludes";
import { use, mongo, authorizer } from "@octopy/serverless-core";
import { workStationSchema } from "../../schemas/workStation";

const catalogueWorkstation = async(event, context) => {
    const { collections: [workStationModel] } = event.useMongo;
    const workstation = workStationModel.find().select("_id name")

    return workstation
}

export const handler = use(catalogueWorkstation, { httpCodes, langConfig, translations })
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