import { Joi } from "@octopy/serverless-core";
import { passwordRegex } from "../../helpers/auth/passwordRegex";

export const changePasswordDTO = Joi.object({
  password: Joi.string().trim().not().empty().min(8).pattern(passwordRegex).required().messages({
    "string.base": "passwordIsNotString",
    "string.empty": "passwordRequired",
    "string.min": "passwordMinLength",
    "string.pattern.base": "passwordPolicyError",
    "any.required": "passwordRequired"
  })
});
