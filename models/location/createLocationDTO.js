import { Joi } from "@octopy/serverless-core";


export const createLocationDTO = Joi.object({
  name: Joi.string().trim().not().empty().min(3).required().messages({
    "string.base": "nameIsNotString",
    "string.empty": "nameRequired",
    "string.min": "nameMinLength",
    "any.required": "nameRequired"
  }),
  
  address: Joi.string().trim().not().empty().min(3).required().messages({
    "string.base": "addresIsNotString",
    "string.empty": "addressRequired",
    "string.min": "addressMinLength",
    "any.required": "addressRequired"
  })
});
