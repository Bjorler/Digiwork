import { Joi } from "@octopy/serverless-core";


export const createNotificationDTO = Joi.object({
  title: Joi.string().trim().not().empty().required().messages({
    "string.base": "nameIsNotString",
    "string.empty": "titleRequired",
    "any.required": "titleRequired"
  }),
  message: Joi.string().trim().not().empty().required().messages({
    "string.base": "messageIsNotString",
    "string.empty": "messageRequired",
    "any.required": "messageRequired"
  }),
  image: Joi.string().trim().not().empty().required().messages({
    "string.empty": "imageRequired",
    "any.required": "imageRequired"
  }),
  to: Joi.array().items(Joi.string().trim().not().empty().required().messages({
    "string.base": "toIsNotString",
    "string.empty": "toRequired",
    "any.required": "toRequired"
  }))
});