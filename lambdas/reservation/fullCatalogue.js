import { langConfig, translations, httpCodes } from "../../commonIncludes";
import { use, mongo, Model} from "@octopy/serverless-core";
import { roomSchema } from "../../schemas/room";
import { workStationSchema } from "../../schemas/workStation";

const fullCatalogue = async(event, context) => {
    const { collections: [roomModel, workStationModel] } = event.useMongo;
    const type_filter = event.queryStringParameters.type;
    
    const query = [{
        $group: {
            _id: "$location",
            options: {
                $push: {
                    _id: "$_id",
                    name: '$name'
                }
            }
        }
    }];

    if(type_filter == 'room') {
        return await roomModel.aggregate(query);
    }
    
    return await workStationModel.aggregate(query);
}

export const handler = use(fullCatalogue, { httpCodes, langConfig, translations })
    .use(authorizer({
        uriDB: process.env.MONGO_CONNECTION, secretKey: process.env.SECRET_KEY,
        roles: ["admin", "user"]
    }))
    .use(mongo({ uri: process.env.MONGO_CONNECTION, models: ["rooms", "work_stations"], schemas: {
        room: roomSchema,
        work_stations: workStationSchema
    } }))