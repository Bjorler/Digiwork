import { Joi } from "@octopy/serverless-core";


export const updateNotificationDTO = Joi.object({
  title: Joi.string().trim().not().empty().messages({
    "string.base": "nameIsNotString",
    "string.empty": "nameRequired",
  }),
  message: Joi.string().trim().not().empty().messages({
    "string.base": "locationIsNotString",
    "string.empty": "locationRequired",
  }),
  image: Joi.string().trim().not().empty().messages({
    "string.base": "locationIsNotString",
    "string.empty": "locationRequired",
  })

});