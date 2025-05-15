import Joi from "joi";

const registerSchema = Joi.object({
    name: Joi.string().min(2).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(60).required(),
    repeat_password: Joi.ref("password")
});

export {
    registerSchema
}