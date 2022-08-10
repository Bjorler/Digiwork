 import { langConfig, translations, httpCodes } from "../../commonIncludes";
import { use, mongo, Model, token, authorizer, mongooseTypes, validateQueryParams } from "@octopy/serverless-core";
import { userSchema } from "../../schemas/user";
import { workStationReservationSchema, roomReservationSchema, parkingReservationSchema } from "../../schemas/reservation";
import { workStationSchema } from "../../schemas/workStation";
import { roomSchema } from "../../schemas/room";
import { parkingSchema } from "../../schemas/parking";
import { locationSchema } from "../../schemas/location";

const listMyReservations = async (event, context) => {
    const { collections: [
        userModel, wsRModel, roomRModel, parkingRModel,
        wsModel, roomModel, parkingModel
    ] } = event.useMongo;
    const { payload } = event.useToken;

    const location_filter = event.queryStringParameters?.location_filter;
    const name_filter = event.queryStringParameters?.name_filter ?? '';

    match = { name: { $regex: name_filter, $options: "i"} };
    if(location_filter) {
        match.location = mongooseTypes.ObjectId(location_filter);
    }

    const ws = await wsRModel.aggregate([
        { $match: { user_id: mongooseTypes.ObjectId(payload._id) } },
        { $lookup: {
            from: 'work_stations',
            localField: 'work_station',
            foreignField: '_id',
            as: 'work_station',
            pipeline: [
                { $match: match },
                { $lookup: {
                    from: 'locations',
                    localField: 'location',
                    foreignField: '_id',
                    as: 'location'
                    }
                },
                { $unwind: '$location' }
            ]
        } },
        { $unwind: '$work_station' }
    ]);

    const room = await roomRModel.aggregate([
        { $match: { user_id: mongooseTypes.ObjectId(payload._id) } },
        { $lookup: {
            from: 'rooms',
            localField: 'room',
            foreignField: '_id',
            as: 'room',
            pipeline: [
                { $match: match },
                { $lookup: {
                    from: 'locations',
                    localField: 'location',
                    foreignField: '_id',
                    as: 'location'
                    }
                },
                { $unwind: '$location' }
            ]
        } },
        { $unwind: '$room' }
    ]);

    const parking = await parkingRModel.aggregate([
        { $match: { user_id: mongooseTypes.ObjectId(payload._id) } },
        { $lookup: {
            from: 'parkings',
            localField: 'parking',
            foreignField: '_id',
            as: 'parking',
            pipeline: [
                { $match: match },
                { $lookup: {
                    from: 'locations',
                    localField: 'location',
                    foreignField: '_id',
                    as: 'location'
                    }
                },
                { $unwind: '$location' }
            ]
        } },
        { $unwind: '$parking' }
    ]);

    return [...ws, ...room, ...parking];
   
}

export const handler = use(listMyReservations, { httpCodes, langConfig, translations })
    .use(authorizer({
        uriDB: process.env.MONGO_CONNECTION, secretKey: process.env.SECRET_KEY,
        roles: ["admin","user"]
    }))
    .use(mongo({
        uri: process.env.MONGO_CONNECTION,
        models: [
            "users", "work_station_reservations", "room_reservations", "parking_reservations",
            "work_stations", "rooms", "parkings", "location"
        ],
        schemas: {
            users: userSchema,
            work_station_reservations: workStationReservationSchema,
            room_reservations: roomReservationSchema,
            parking_reservations: parkingReservationSchema,
            work_stations: workStationSchema,
            rooms: roomSchema,
            parkings: parkingSchema,
            location: locationSchema
        }
    }))
    .use(token(process.env.SECRET_KEY))