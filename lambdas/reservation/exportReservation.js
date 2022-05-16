import { langConfig, translations, httpCodes } from "../../commonIncludes";
import { use, mongo, authorizer } from "@octopy/serverless-core";
import { workStationReservationSchema, roomReservationSchema } from "../../schemas/reservation";
import { generateCSVFile } from "../../helpers/shared/generate-csv-file"

const exportReservation = async (event, context) => {
    const { collections: [wsReservationModel, roomReservationModel] } = event.useMongo;

    const wsReservations = await wsReservationModel.aggregate([
        {
            $lookup: {
                from: "work_stations",
                localField: "work_station",
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
                reservation_type: "workstation",
                location: "$reservation.location.name",
                public_id: 1
            },
        }
    ])

    const roomReservations = await roomReservationModel.aggregate([
        {
            $lookup: {
                from: "rooms",
                localField: "room",
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
                reservation_type: "room",
                location: "$reservation.location.name",
                public_id: 1
            },
        }
    ])

    const date = new Date();
    const day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    const month = date.getMonth() < 9 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;

    const generated = await generateCSVFile({
        headers: [
            { id: "public_id", title: "ID" },
            { id: "location", title: "Ubicación" },
            { id: "reservation_type", title: "Tipo de reservación" },
            { id: "name", title: "Nombre" },
            { id: "start_date", title: "Fecha" },
            { id: "user", title: "Usuario" },
        ],
        content: [...wsReservations, ...roomReservations]
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
        models: ["work_station_reservations", "room_reservations", "locations"],
        schemas: {
            work_station_reservations: workStationReservationSchema,
            room_reservations: roomReservationSchema
        }
    }))