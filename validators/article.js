import Joi from "joi";

export const addArticleValidator = Joi.object({
    title: Joi.string().required(),
    content: Joi.string().required()
});