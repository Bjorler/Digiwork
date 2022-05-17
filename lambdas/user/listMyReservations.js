import { langConfig, translations, httpCodes } from "../../commonIncludes";
import { use, mongo, Model, token, authorizer, mongooseTypes, validateQueryParams } from "@octopy/serverless-core";
import { userSchema } from "../../schemas/user";
import { workStationReservationSchema, roomReservationSchema } from "../../schemas/reservation";
import { ReservationEnum } from "../../helpers/shared/enums";

const listMyReservations = async (event, context) => {
    const { collections: [userModel, wsReservationModel, roomReservationModel] } = event.useMongo;
    const { payload } = event.useToken;
    const reservations_types = ["workstation", "room"];
    const name_filter = event.queryStringParameters?.name ?? '';
    const location_filter = event.queryStringParameters?.location ?? null;
    let reservations = [];
    let collection;

    for (const type in reservations_types) {
        collection = reservations_types[type] === ReservationEnum.work_station ? wsReservationModel : roomReservationModel;

        const match = {
            name: { $regex: name_filter, $options: "i"},
        }
    
        if (location_filter) {
            match.location = mongooseTypes.ObjectId(location_filter);
        }


        let ws = await collection.aggregate([
            {
                $match: {
                    user_id: mongooseTypes.ObjectId(payload._id),  
                }
            },
            {
                $lookup: {
                    from: reservations_types[type] === ReservationEnum.work_station ? "work_stations" : "rooms",
                    localField: reservations_types[type] === ReservationEnum.work_station ? "work_station" : "room",
                    pipeline: [
                        {
                            $match: match
                        },
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
            { $unwind: "$reservation" },
            {
                $project: {
                    _id: 1,
                    location: "$reservation.location.name",
                    name: "$reservation.name",
                    start_date: 1,
                    end_date: 1,
                    reservation_type: reservations_types[type],
                    check_in: 1,
                    status: 1,
                    public_id: 1
                },
            }
        ])
        Array.prototype.push.apply(reservations, ws)
    }

    return reservations;
}

export const handler = use(listMyReservations, { httpCodes, langConfig, translations })
    .use(authorizer({
        uriDB: process.env.MONGO_CONNECTION, secretKey: process.env.SECRET_KEY,
        roles: ["admin","user"]
    }))
    .use(mongo({
        uri: process.env.MONGO_CONNECTION,
        models: ["users", "work_station_reservations", "room_reservations"],
        schemas: {
            users: userSchema,
            work_station_reservations: workStationReservationSchema,
            room_reservations: roomReservationSchema,
        }
    }))
    .use(token(process.env.SECRET_KEY))