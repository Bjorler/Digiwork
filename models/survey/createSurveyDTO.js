import { Joi } from "@octopy/serverless-core";


export const createSurveyDTO = Joi.object({
  title: Joi.string().trim().not().empty().min(3).required().messages({
    "string.base": "titleIsNotString",
    "string.empty": "titleRequired",
    "string.min": "titleMinLength",
    "any.required": "titleRequired"
  }),
  
  question: Joi.string().trim().not().empty().min(3).required().messages({
    "string.base": "questionIsNotString",
    "string.empty": "questionRequired",
    "string.min": "questionMinLength",
    "any.required": "questionRequired"
  }),
  
  answer: Joi.boolean().trim().not().empty().min(3).required().messages({
    "string.base": "answerIsNotBoolean",
    "string.empty": "empty",
    "any.required": "answerRequired"
  }),

});
