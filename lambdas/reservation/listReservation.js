import { langConfig, translations, httpCodes } from "../../commonIncludes";
import { use, mongo, Model, authorizer, dayjs } from "@octopy/serverless-core";
import { workStationReservationSchema, roomReservationSchema, parkingReservationSchema } from "../../schemas/reservation";
import { locationSchema } from "../../schemas/location";
import { ReservationEnum } from "../../helpers/shared/enums";

const listReservation = async (event, context) => {
    const { collections: [wsReservationModel, roomReservationModel, parkingReservationModel] } = event.useMongo;
    
    // const location = (await Model(locationModel).getById(event.queryStringParameters.location))?.name || "";
    const date = event.queryStringParameters?.date || "";
    const type = event.queryStringParameters.type;

    const collection = type === ReservationEnum.work_station 
        ? wsReservationModel 
        : ReservationEnum.room ? roomReservationModel
        : parkingReservationModel;
    const queryMatch = {
        // "reservation.location.name": { $regex: location, $options: "i" },
    };

    if (date) {
        queryMatch.date_formated = new Date(date).toISOString()
    }

    const reservations = await collection.aggregate([
        {
            $lookup: {
                from: type === ReservationEnum.work_station ? "work_stations" 
                : ReservationEnum.room ? "rooms" 
                : "parkings",
                localField: type === ReservationEnum.work_station ? "work_station" 
                : ReservationEnum.room ? "room" 
                : "parking",
                pipeline: [
                    {
                        $lookup: {
                            from: "locations",
                            localField: "location",
                            foreignField: "_id",
                            as: "location",
                        }
                    },
                    {
                        $unwind: "$location"
                    }
                ],
                foreignField: "_id",
                as: "reservation",
            },
        },
        // { $unwind: "$reservation" },
        {
            $lookup: {
                from: "users",
                localField: "user_id",
                foreignField: "_id",
                as: "user",
            }
        },     
        // { $unwind: "$user" },
        // {
        //     $addFields: {
        //         date_formated: { $dateToString: { format: "%Y-%m-%dT%H:00:00.000Z", date: "$start_date" } }
        //     }
        // },
        // {
        //     $match: queryMatch
        // },
        // {
        //     $project: {
        //         _id: 1,
        //         user: "$user.name",
        //         name: "$reservation.name",
        //         start_date: 1,
        //         end_date: 1,
        //         reservation_type: type,
        //         check_in: 1,
        //         location: "$reservation.location.name",
        //         public_id: 1
        //     },
        // }
    ])

    return reservations;
}

export const handler = use(listReservation, { httpCodes, langConfig, translations })
    .use(authorizer({
        uriDB: process.env.MONGO_CONNECTION, secretKey: process.env.SECRET_KEY,
        roles: ["admin"]
    }))
    .use(mongo({
        uri: process.env.MONGO_CONNECTION,
        models: ["work_station_reservations", "room_reservations", "parking_reservations"],
        schemas: {
            work_station_reservations: workStationReservationSchema,
            room_reservations: roomReservationSchema,
            parking_reservations: parkingReservationSchema,
            locations: locationSchema,
        }
    }))