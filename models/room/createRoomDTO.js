import { Joi } from "@octopy/serverless-core";


export const createRoomDTO = Joi.object({
  name: Joi.string().trim().not().empty().min(3).required().messages({
    "string.base": "nameIsNotString",
    "string.empty": "nameRequired",
    "string.min": "nameMinLength",
    "any.required": "nameRequired"
  }),
  
  location: Joi.string().trim().not().empty().min(3).required().messages({
    "string.base": "locationIsNotString",
    "string.empty": "locationRequired",
    "string.min": "locationMinLength",
    "any.required": "locationRequired"
  }),
  spaces: Joi.number().required().messages({
    "number.base": "spaceIsNotString",
    "any.required": "spaceRequired"
  }),
  amenities: Joi.string().trim().not().empty().min(3).required().messages({
    "string.base": "amenitiesIsNotString",
    "string.empty": "amenitiesRequired",
    "string.min": "amenitiesMinLength",
    "any.required": "amenitiesRequired"
  }),
});