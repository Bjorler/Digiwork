import { Joi } from "@octopy/serverless-core";
import { ReservationEnum } from "../../helpers/shared/enums";
import { objectIdRegex } from "../../helpers/shared/regex";

export const createReservationDTO = Joi.object({
    reservation_type: Joi.string().valid(ReservationEnum.room, ReservationEnum.work_station).required().messages({
        "string.base": "reservationTypeIsString",
        "any.only": "reservationTypeInvalid",
        "any.required": "reservationTypeRequired"
    }),
    id_name: Joi.string().trim().not().empty().pattern(objectIdRegex).required().messages({
        "string.base": "idNameIsString",
        "string.empty": "idNameRequired",
        "string.pattern.base": "idNameInvalid",
        "any.required": "idNameRequired"
    }),
    start_date: Joi.date().required().messages({
        "any.required": "startDateRequired",
        "date.greater": "startDateCurrentDay",
    }),
    end_date: Joi.date().required().messages({
        "any.required": "endDateRequired",
        "date.greater": "endDateCurrentDay",
    }),
    comment: Joi.string().trim().not().empty().messages({
        "string.base": "commentIsNotString",
        "string.empty": "commentIsRequired"
    })
});
