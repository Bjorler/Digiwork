import { Joi } from "@octopy/serverless-core";


export const createWorkstationDTO = Joi.object({
  name: Joi.string().trim().not().empty().required().messages({
    "string.base": "nameIsNotString",
    "string.empty": "nameRequired",
    "any.required": "nameRequired"
  }),
  location: Joi.string().trim().not().empty().required().messages({
    "string.base": "locationIsNotString",
    "string.empty": "locationRequired",
    "any.required": "locationRequired"
  })
});