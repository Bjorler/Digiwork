import { langConfig, translations, httpCodes } from "../../commonIncludes";
import { use, mongo, validateBody,authorizer } from "@octopy/serverless-core";
import { roomSchema } from '../../schemas/room';
import { createRoomDTO } from "../../models/room/createRoomDTO";


const createRoom = async(event, context) => {
    const { collections: [roomModel] } = event.useMongo;
    console.log('body', event.body);
    const room = await roomModel.create(event.body);
    console.log('room', room);
    return room
}

export const handler = use(createRoom, { httpCodes, langConfig, translations })
    .use(authorizer({
        uriDB: process.env.MONGO_CONNECTION, secretKey: process.env.SECRET_KEY,
        roles: ["admin"]
    }))
    .use(validateBody(
        createRoomDTO,
        translations
    ))
    .use(mongo({ 
        uri: process.env.MONGO_CONNECTION, 
        models: ["rooms"], 
        schemas: {
            rooms: roomSchema
        } 
    }));
