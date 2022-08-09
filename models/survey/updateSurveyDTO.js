import { Joi } from "@octopy/serverless-core";


export const updateSurveyDTO = Joi.object({
  name: Joi.string().trim().not().empty().min(3).messages({
    "string.base": "nameIsNotString",
    "string.empty": "nameRequired",
    "string.min": "nameMinLength"
  }),
  
  address: Joi.string().trim().not().empty().min(3).messages({
    "string.base": "addresIsNotString",
    "string.empty": "addressRequired",
    "string.min": "addressMinLength" 
  })
});