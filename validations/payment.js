import Joi from "joi";

const createPaymentSchema = Joi.object({
    name: Joi.string().trim().required()
});

const updatePaymentSchema = Joi.object({
    name: Joi.string().trim().required()
});

export {
    createPaymentSchema,
    updatePaymentSchema
}