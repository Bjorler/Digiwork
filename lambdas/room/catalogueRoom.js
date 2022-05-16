import { langConfig, translations, httpCodes } from "../../commonIncludes";
import { use, mongo, authorizer } from "@octopy/serverless-core";
import { roomSchema } from '../../schemas/room';


const catalogueRoom = async(event, context) => {
    const { collections: [roomModel] } = event.useMongo;
    const workstation = await roomModel.find().select("_id name")

    return workstation
}

export const handler = use(catalogueRoom, { httpCodes, langConfig, translations })
    .use(authorizer({
        uriDB: process.env.MONGO_CONNECTION, secretKey: process.env.SECRET_KEY,
        roles: ["admin"]
    }))
    .use(mongo({ 
        uri: process.env.MONGO_CONNECTION, 
        models: ["rooms"], 
        schemas: {
            rooms: roomSchema
        } 
    }));