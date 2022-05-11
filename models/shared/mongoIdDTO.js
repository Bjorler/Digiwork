import { Joi } from "@octopy/serverless-core";
import { objectIdRegex } from "../../helpers/shared/regex";

export const mongoIdDTO = Joi.object({
    id: Joi.string().trim().not().empty().pattern(objectIdRegex).required().messages({
        "string.base": "idIsString",
        "string.pattern.base": "idInvalid"
    })
});