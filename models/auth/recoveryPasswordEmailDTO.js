import { Joi } from "@octopy/serverless-core";

export const recoveryPasswordEmailDTO = Joi.object({
  email: Joi.string().trim().not().empty().email().required().messages({
    "string.base": "emailIsNotString",
    "string.email": "isNotEmail",
    "string.empty": "emailRequired",
    "any.required": "emailRequired"
  }),
});
