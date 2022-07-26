import { langConfig, translations, httpCodes } from "../../commonIncludes";
import { use, mongo, Model, authorizer, dayjs } from "@octopy/serverless-core";
import { workStationReservationSchema, roomReservationSchema, parkingReservationSchema } from "../../schemas/reservation";
import { locationSchema } from "../../schemas/location";
import { ReservationEnum } from "../../helpers/shared/enums";
import { parkingSchema } from "../../schemas/parking";

const listReservation = async (event, context) => {
    const { collections: [wsReservationModel, roomReservationModel, parkingReservationModel] } = event.useMongo;
   
    const reservation_date = event.queryStringParameters?.date;
    const reservation_type = event.queryStringParameters.type;

    const filter = {};
    if(reservation_date) {
        filter.date_formated = new Date(date).toISOString();
    }

    let reservations;
    if(reservation_type == ReservationEnum.work_station) {
        reservations = await wsReservationModel.find(filter).populate('user_id')
            .populate({ path: 'work_stations', populate: { path: 'location' } })
    } else if(reservation_type == ReservationEnum.room) {
        reservations = await roomReservationModel.find(filter).populate('user_id')
            .populate({ path: 'rooms', populate: { path: 'location' } })
    } else {
        reservations = await parkingReservationModel.find(filter).populate('user_id')
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
            "parkings", "location"],
        schemas: {
            work_station_reservations: workStationReservationSchema,
            room_reservations: roomReservationSchema,
            parking_reservations: parkingReservationSchema,
            parkings: parkingSchema,
            location: locationSchema,
        }
    }))