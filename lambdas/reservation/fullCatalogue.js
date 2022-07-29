import { langConfig, translations, httpCodes } from "../../commonIncludes";
import { use, mongo, authorizer} from "@octopy/serverless-core";
import { roomSchema } from "../../schemas/room";
import { workStationSchema } from "../../schemas/workStation";
import { parkingSchema } from "../../schemas/parking";

const fullCatalogue = async(event, context) => {
    const { collections: [roomModel, workStationModel, parkingModel] } = event.useMongo;
    const type_filter = event.queryStringParameters?.type_filter;
    console.log(type_filter);
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
   
    if(type_filter == 'work_station') {
        return await workStationModel.aggregate(query);
    }
    
    if (type_filter == 'parking') {
        return await parkingModel.aggregate(query);
    }

    
    return await workStationModel.aggregate(query);
}

export const handler = use(fullCatalogue, { httpCodes, langConfig, translations })
    .use(authorizer({
        uriDB: process.env.MONGO_CONNECTION, secretKey: process.env.SECRET_KEY,
        roles: ["admin", "user"]
    }))
    .use(mongo({ uri: process.env.MONGO_CONNECTION, models: ["rooms", "work_stations", "parkings"], schemas: {
        room: roomSchema,
        work_stations: workStationSchema,
        parking: parkingSchema
    } }))