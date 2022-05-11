import { langConfig, translations, httpCodes } from "../../commonIncludes";
import { use, mongo, authorizer, validateBody} from "@octopy/serverless-core";
import { roomSchema } from '../../schemas/room';
import { updateRoomDTO } from "../../models/room/updateRoomDTO";


const updateRoom = async(event, context) => {
    const { collections: [roomModel] } = event.useMongo;
    const id = event.pathParameters?.id;
    const body = event.body
    const room = await roomModel.findByIdAndUpdate(id,body)
    return room
}

export const handler = use(updateRoom, { httpCodes, langConfig, translations })
    .use(authorizer({
        uriDB: process.env.MONGO_CONNECTION, secretKey: process.env.SECRET_KEY,
        roles: ["admin"]
    })) 
    .use(validateBody(updateRoomDTO, translations))
    .use(mongo({ 
        uri: process.env.MONGO_CONNECTION, 
        models: ["room"], 
        schemas: {
            locations: roomSchema
        } 
    }));