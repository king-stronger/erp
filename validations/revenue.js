import Joi from "joi";

const createRevenueSchema = Joi.object({
    amount: Joi.number().required(),
    description: Joi.string().trim().required(),
    categoryId: Joi.number().required(),
    paymentMethodId: Joi.number().required(),
    date: Joi.date().required()
});

const updateRevenueSchema = Joi.object({
    amount: Joi.number().positive(),
    date: Joi.date(),
    description: Joi.string().trim().allow(null, ''),
    categoryId: Joi.number().integer(),
    paymentMethodId: Joi.number().integer(),
});

export {
    createRevenueSchema,
    updateRevenueSchema
}