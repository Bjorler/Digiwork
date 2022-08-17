import { langConfig, translations, httpCodes } from "../../commonIncludes";
import { use, mongo, Model, validateBody, token, authorizer } from "@octopy/serverless-core";
import { workStationReservationSchema, roomReservationSchema, parkingReservationSchema } from "../../schemas/reservation";
import { userSchema } from "../../schemas/user";
import { createReservationDTO } from "../../models/reservation/createReservationDTO";
import { ReservationEnum, ReservationStatus } from "../../helpers/shared/enums";
import { EmailNotification } from "../../helpers/auth/EmailNotification";
import { workStationSchema } from "../../schemas/workStation";
import { roomSchema } from "../../schemas/room";
import { parkingSchema } from "../../schemas/parking";


const createReservation = async (event, context) => {
    const { collections: [wsReservationModel, roomReservationModel, pReservationModel, userModel ] } = event.useMongo;
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
    const user = await Model(userModel).getById(data.user_id);

    if(!reservation || !user) {
        throw { scode: 'notificationFailed'};
    }

    await new EmailNotification("reservationAlert", "Notificacion de Reservacion", { 
        email: user.email, // para hacer pruebas usar correo personal: 'gth086@gmail.com'
        reservation_date: new Date(reservation.start_date).toLocaleDateString(),
        reservation_hour: new Date(reservation.start_date).toLocaleTimeString()
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
        models: ["work_station_reservations", "room_reservations", "parking_reservations", "users"],
        schemas: {
            work_station_reservations: workStationReservationSchema,
            room_reservations: roomReservationSchema,
            parking_reservations: parkingReservationSchema,
            userModel: userSchema,
            work_station: workStationSchema,
            room: roomSchema,
            parking: parkingSchema
        }
    }))
    .use(token(process.env.SECRET_KEY))