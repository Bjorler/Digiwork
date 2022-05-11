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
    }),
    email: Joi.string().trim().not().empty().email().required().messages({
        "string.base": "emailIsNotString",
        "string.empty": "emailRequired",
        "string.email": "isNotEmail",
        "any.required": "emailRequired"
    }),
});

export const updateProfileUserDTO = Joi.object({
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
    email: Joi.string().trim().not().empty().email().required().messages({
        "string.base": "emailIsNotString",
        "string.empty": "emailRequired",
        "string.email": "isNotEmail",
        "any.required": "emailRequired"
    }),
});
