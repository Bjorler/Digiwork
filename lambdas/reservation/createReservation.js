import { langConfig, translations, httpCodes } from "../../commonIncludes";
import { use, mongo, Model, validateBody, token, authorizer } from "@octopy/serverless-core";
import { workStationReservationSchema, roomReservationSchema, parkingReservationSchema } from "../../schemas/reservation"
import { createReservationDTO } from "../../models/reservation/createReservationDTO"
import { ReservationEnum, ReservationStatus } from "../../helpers/shared/enums";
import { AuthEmailRepository } from "../../helpers/auth/AuthEmailRepository"


const createReservation = async (event, context) => {
    const { collections: [wsReservationModel, roomReservationModel, pReservationModel ] } = event.useMongo;
    const { payload } = event.useToken;
    const { reservation_type, start_date, end_date } = event.body;
    const parsed_start_date = new Date(start_date);
    const parsed_end_date = new Date(end_date);
    
    const data = { 
        ...event.body, 
        user_id: payload?._id, 
        status: ReservationStatus.approved,
        check_in: payload.role === "admin" ? true : false,
    }
    
    delete data.reservation_type;
    delete data.id_name;
    data.start_date = new Date(parsed_start_date).toISOString();
    data.end_date = new Date(parsed_end_date).toISOString();
    
    if (reservation_type === ReservationEnum.work_station) {
        data.work_station = event.body.id_name;
    } else if (reservation_type === ReservationEnum.room) {
        data.room = event.body.id_name;
    } else {
        data.parking = event.body.id_name;
    }

    let modelo;
    switch (reservation_type) {
        case ReservationEnum.work_station:
            modelo = wsReservationModel
            break;
        case ReservationEnum.room:
            modelo = roomReservationModel
            break;
        case ReservationEnum.parking:
            modelo = pReservationModel
            break;
        default: throw { scode: 'reservationNotFound'};
    }
    
    const reservation = await Model(modelo).create(data)

    await new AuthEmailRepository("reservation", "Notificacion de reservacion", {
        home: process.env.APP_FRONTEND_BASE_URL,
        email: event.body.email,
    }).sendEmail();

    return reservation;
}

export const handler = use(createReservation, { httpCodes, langConfig, translations })
    .use(authorizer({
        uriDB: process.env.MONGO_CONNECTION, secretKey: process.env.SECRET_KEY,
        roles: ["admin", "user"]
    }))
    .use(validateBody(createReservationDTO, translations))
    .use(mongo({
        uri: process.env.MONGO_CONNECTION,
        models: ["work_station_reservations", "room_reservations", "parking_reservations"],
        schemas: {
            work_station_reservations: workStationReservationSchema,
            room_reservations: roomReservationSchema,
            parking_reservations: parkingReservationSchema
        }
    }))
    .use(token(process.env.SECRET_KEY))