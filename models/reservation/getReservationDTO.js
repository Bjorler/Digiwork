import { Joi } from "@octopy/serverless-core";
import { ReservationEnum } from "../../helpers/shared/enums";
import { objectIdRegex } from "../../helpers/shared/regex"

export const getReservationDTO = Joi.object({
    id: Joi.string().trim().not().empty().pattern(objectIdRegex).required().messages({
        "string.base": "idIsString",
        "string.pattern.base": "idInvalid"
    }),
    reservation_type: Joi.string().valid(ReservationEnum.room, ReservationEnum.work_station).required().messages({
        "string.base": "reservationTypeIsString",
        "any.only": "reservationTypeInvalid",
        "any.required": "reservationTypeRequired"
    })
});