import { langConfig, translations, httpCodes } from "../../commonIncludes";
import { use, mongo, Model, authorizer, dayjs } from "@octopy/serverless-core";
import { workStationReservationSchema, roomReservationSchema, parkingReservationSchema } from "../../schemas/reservation";
import { locationSchema } from "../../schemas/location";
import { ReservationEnum } from "../../helpers/shared/enums";
import { parkingSchema } from "../../schemas/parking";
import { roomSchema } from "../../schemas/room";
import { workStationSchema } from "../../schemas/workStation";

const listReservation = async (event, context) => {
    const { collections: [wsReservationModel, roomReservationModel, parkingReservationModel] } = event.useMongo;
   
    const reservation_type = event.queryStringParameters?.reservation_type ?? "";
    const reservation_date = event.queryStringParameters?.reservation_date ?? "";

    const filter = {};
    if(reservation_date) {
        // const end_date = new Date ({$set: {date: { $dateAdd: { start_date: "$date", unit: "day" , amount: 1}}}})
        // console.log(end_date);
        filter.start_date ={ $gte:  new Date(reservation_date).toISOString()}
    }
    console.log(filter, 'si pasa');
    
    let reservations;
    if(reservation_type == ReservationEnum.work_station) {
        reservations = await wsReservationModel.find(filter)
            .populate('user_id')
            .populate({ path: 'work_station', populate: { path: 'location' } })
    } else if(reservation_type == ReservationEnum.room) {
        reservations = await roomReservationModel.find(filter)
            .populate('user_id')
            .populate({ path: 'room', populate: { path: 'location' } })
    } else {
        reservations = await parkingReservationModel.find(filter)
            .populate('user_id',).select('-notifications')
            .populate({ path: 'parking', populate: { path: 'location' } })
    }
    
    return reservations;
}

export const handler = use(listReservation, { httpCodes, langConfig, translations })
    .use(authorizer({
        uriDB: process.env.MONGO_CONNECTION, secretKey: process.env.SECRET_KEY,
        roles: ["admin"]
    }))
    .use(mongo({
        uri: process.env.MONGO_CONNECTION,
        models: ["work_station_reservations", "room_reservations", "parking_reservations",
             "work_stations","rooms", "parkings", "location"],
        schemas: {
            work_station_reservations: workStationReservationSchema,
            room_reservations: roomReservationSchema,
            parking_reservations: parkingReservationSchema,
            parkings: parkingSchema,
            rooms: roomSchema,
            work_stations: workStationSchema,
            location: locationSchema,
        }
    }))