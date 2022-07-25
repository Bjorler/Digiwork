import { langConfig, translations, httpCodes } from "../../commonIncludes";
import { use, mongo, authorizer } from "@octopy/serverless-core";
import { workStationReservationSchema, roomReservationSchema, parkingReservationSchema } from "../../schemas/reservation";
import { generateCSVFile } from "../../helpers/shared/generate-csv-file";
import { ReservationEnum } from "../../helpers/shared/enums"

const exportReservation = async (event, context) => {
    const { collections: [wsReservationModel, roomReservationModel, parkingReservationModel] } = event.useMongo;

    const reservations_types = ["workstation", "room", "parking"];
    let reservations = [];
    let collection;

    for (const type in reservations_types) {
        collection = reservations_types[type] === ReservationEnum.work_station 
        ? wsReservationModel 
        : ReservationEnum.room ? roomReservationModel
        : parkingReservationModel
        let ws = await collection.aggregate([
            {
                $lookup: {
                    from: reservations_types[type] === ReservationEnum.work_station 
                    ? "work_stations" 
                    : ReservationEnum.room ? "rooms" 
                    : "parkings",
                    localField: reservations_types[type] === ReservationEnum.work_station 
                    ? "work_station" 
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
            {
                $lookup: {
                    from: "users",
                    localField: "user_id",
                    foreignField: "_id",
                    as: "user",
                }
            },
            { $unwind: "$reservation" },
            { $unwind: "$user" },
            {
                $project: {
                    _id: 1,
                    user: "$user.name",
                    name: "$reservation.name",
                    start_date: 1,
                    end_date: 1,
                    type: reservations_types[type],
                    location: "$reservation.location.name",
                    public_id: 1
                },
            }
        ])
        Array.prototype.push.apply(reservations, ws)
    }

    const date = new Date();
    const day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    const month = date.getMonth() < 9 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;

    const generated = await generateCSVFile({
        headers: [
            { id: "public_id", title: "ID" },
            { id: "location", title: "Ubicacion" },
            { id: "type", title: "Tipo de reservacion" },
            { id: "name", title: "Nombre" },
            { id: "start_date", title: "Fecha" },
            { id: "user", title: "Usuario" },
        ],

        content: reservations
    },
        `Reservaciones_${day}-${month}-${date.getFullYear()}`)
    return {
        url: generated.url
    };
}

export const handler = use(exportReservation, { httpCodes, langConfig, translations })
    .use(authorizer({
        uriDB: process.env.MONGO_CONNECTION, secretKey: process.env.SECRET_KEY,
        roles: ["admin"]
    }))
    .use(mongo({
        uri: process.env.MONGO_CONNECTION,
        models: ["work_station_reservations", "room_reservations", "parking_reservations", "locations"],
        schemas: {
            work_station_reservations: workStationReservationSchema,
            room_reservations: roomReservationSchema,
            parking_reservations: parkingReservationSchema
        }
    }))