import { langConfig, translations, httpCodes } from "../../commonIncludes";
import { use, mongo, authorizer } from "@octopy/serverless-core";
import { roomSchema } from '../../schemas/room';


const listRoom = async(event, context) => {
    const { collections: [roomModel] } = event.useMongo;
    const location_filter = event.queryStringParameters?.location
    const name_filter = event.queryStringParameters?.name ?? ""

    const match = {
        name: { $regex: name_filter, $options: "i"},
    }

    if (location_filter) {
        match.location = location_filter
    }

    const room = await roomModel.find(match);

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
            rooms: roomSchema
        } 
    }));