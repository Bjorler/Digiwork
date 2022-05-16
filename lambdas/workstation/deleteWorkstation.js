import { langConfig, translations, httpCodes } from "../../commonIncludes";
import { use, mongo, authorizer, mongooseTypes} from "@octopy/serverless-core";
import { workStationSchema } from "../../schemas/workStation";
import { workStationReservationSchema } from "../../schemas/reservation"

const deleteWorkstation = async(event, context) => {
    const { collections: [workStationModel, wsReservationModel] } = event.useMongo;
    const id = event.pathParameters?.id;

    await wsReservationModel.deleteMany({
        work_station: mongooseTypes.ObjectId(id)
    });
    
    const workstation = workStationModel.findByIdAndDelete(id)

    return workstation
}

export const handler = use(deleteWorkstation, { httpCodes, langConfig, translations })
    .use(authorizer({
        uriDB: process.env.MONGO_CONNECTION, secretKey: process.env.SECRET_KEY,
        roles: ["admin"]
    }))
    .use(mongo({ 
        uri: process.env.MONGO_CONNECTION, 
        models: ["work_stations","work_station_reservations"],
        schemas: {
            work_stations: workStationSchema,
            work_station_reservations: workStationReservationSchema
        } 
    }))