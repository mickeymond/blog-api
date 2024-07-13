import Joi from "joi";

export const registerValidator = Joi.object({
    name: Joi.string().required(),
    username: Joi.string().alphanum().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
});

export const loginValidator = Joi.object({
    username: Joi.string().alphanum(),
    email: Joi.string().email(),
    password: Joi.string().required(),
});