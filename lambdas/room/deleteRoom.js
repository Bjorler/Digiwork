import { langConfig, translations, httpCodes } from "../../commonIncludes";
import { use, mongo, authorizer} from "@octopy/serverless-core";
import { roomSchema } from "../../schemas/room";

const deleteRoom = async(event, context) => {
    const { collections: [roomModel] } = event.useMongo;
    const id = event.pathParameters?.id;
    
    const room = roomModel.findByIdAndDelete(id)

    return room
}

export const handler = use(deleteRoom, { httpCodes, langConfig, translations })
    .use(authorizer({
        uriDB: process.env.MONGO_CONNECTION, secretKey: process.env.SECRET_KEY,
        roles: ["admin"]
    }))
    .use(mongo({ 
        uri: process.env.MONGO_CONNECTION, 
        models: ["room"],
        schemas: {
            rooms: roomSchema
        } 
    }))