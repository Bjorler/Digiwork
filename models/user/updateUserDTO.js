import { Joi } from "@octopy/serverless-core";
import { onlyNumbers } from "../../helpers/shared/regex" 

export const updateUserDTO = Joi.object({
    name: Joi.string().trim().not().empty().required().messages({
        "string.base": "nameIsNotString",
        "string.empty": "nameIsRequired",
        "any.required": "nameIsRequired"
    }),
    phone: Joi.string().trim().pattern(onlyNumbers).not().empty().required().messages({
        "string.base": "phoneIsNotString",
        "string.empty": "phoneIsRequired",
        "any.required": "phoneIsRequired",
        "string.pattern.base": "phoneRegex",
    }),
    is_admin: Joi.boolean().messages({
        "boolean.base": "isAdminIsBolean"
    })
});
