import { Joi } from "@octopy/serverless-core";


export const updateWorkstationDTO = Joi.object({
  name: Joi.string().trim().not().empty().messages({
    "string.base": "nameIsNotString",
    "string.empty": "nameRequired",
  }),
  location: Joi.string().trim().not().empty().messages({
    "string.base": "locationIsNotString",
    "string.empty": "locationRequired",
  })
});