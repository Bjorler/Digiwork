import { Joi } from "@octopy/serverless-core";
import { passwordRegex } from "../../helpers/auth/passwordRegex";


export const loginDTO = Joi.object({
  email: Joi.string().trim().not().empty().email().required().messages({
    "string.base": "emailIsNotString",
    "string.email": "isNotEmail",
    "string.empty": "emailRequired",
    "any.required": "emailRequired"
  }),
  password: Joi.string().trim().min(8).not().empty().pattern(passwordRegex).required().messages({
    "string.base": "passwordIsNotString",
    "string.min": "passwordMinLength",
    "string.empty": "passwordRequired",
    "string.pattern.base": "passwordPolicyError",
    "any.required": "passwordRequired"
  })
});
