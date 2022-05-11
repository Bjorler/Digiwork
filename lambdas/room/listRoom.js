import { langConfig, translations, httpCodes } from "../../commonIncludes";
import { use, mongo, validateBody,authorizer } from "@octopy/serverless-core";
import { roomSchema } from '../../schemas/room';


const listRoom = async(event, context) => {
    const { collections: [roomModel] } = event.useMongo;
    const room = await roomModel.find();

    return room
}

export const handler = use(listRoom, { httpCodes, langConfig, translations })
    .use(authorizer({
        uriDB: process.env.MONGO_CONNECTION, secretKey: process.env.SECRET_KEY,
        roles: ["admin"]
    }))
    .use(mongo({ 
        uri: process.env.MONGO_CONNECTION, 
        models: ["rooms"], 
        schemas: {
            locations: roomSchema
        } 
    }));