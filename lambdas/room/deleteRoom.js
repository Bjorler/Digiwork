import { langConfig, translations, httpCodes } from "../../commonIncludes";
import { use, mongo, authorizer, mongooseTypes} from "@octopy/serverless-core";
import { roomSchema } from "../../schemas/room";
import { roomReservationSchema } from "../../schemas/reservation"

const deleteRoom = async(event, context) => {
    const { collections: [roomModel, roomReservationModel] } = event.useMongo;
    const id = event.pathParameters?.id;

    await roomReservationModel.deleteMany({
        room: mongooseTypes.ObjectId(id)
    });
    
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
        models: ["room", "room_reservations"],
        schemas: {
            rooms: roomSchema,
            work_station_reservations: roomReservationSchema
        } 
    }))