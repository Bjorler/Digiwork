import { Joi } from "@octopy/serverless-core";


export const updateRoomDTO = Joi.object({
  name: Joi.string().trim().not().empty().min(3).messages({
    "string.base": "nameIsNotString",
    "string.empty": "nameRequired",
    "string.min": "nameMinLength",
    "any.required": "nameRequired"
  }),
  
  location: Joi.string().trim().not().empty().min(3).messages({
    "string.base": "locationIsNotString",
    "string.empty": "locationRequired",
    "string.min": "locationMinLength",
    "any.required": "locationRequired"
  }),
  spaces: Joi.number().messages({
    "number.base": "spaceIsNotString",
    "any.required": "spaceRequired"
  }),
  amenities: Joi.string().trim().not().empty().min(3).messages({
    "string.base": "amenitiesIsNotString",
    "string.empty": "amenitiesRequired",
    "string.min": "amenitiesMinLength",
    "any.required": "amenitiesRequired"
  }),
});