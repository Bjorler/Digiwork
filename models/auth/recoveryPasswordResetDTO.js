import { Joi } from "@octopy/serverless-core";
import { passwordRegex } from "../../helpers/auth/passwordRegex";

export const recoveryPasswordResetDTO = Joi.object({
  token: Joi.string().trim().not().empty().required().messages({
    "string.base": "tokenIsNotString",
    "string.empty": "tokenRequired",
    "any.required": "tokenRequired"
  }),
  password: Joi.string().trim().min(8).not().empty().pattern(passwordRegex).required().messages({
    "string.base": "passwordIsNotString",
    "string.empty": "passwordRequired",
    "string.min": "passwordMinLength",
    "string.pattern.base": "passwordPolicyError",
    "any.required": "passwordRequired"
  })
});
