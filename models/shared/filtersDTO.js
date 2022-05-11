import { Joi } from "@octopy/serverless-core";

export const filterNameDTO = Joi.object({
    name: Joi.any().optional(),
});