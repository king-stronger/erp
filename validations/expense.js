import Joi from "joi";

const createExpenseSchema = Joi.object({
    amount: Joi.number().required(),
    description: Joi.string().trim().required(),
    categoryId: Joi.number().required(),
    paymentMethodId: Joi.number().required(),
    date: Joi.date().required()
});

const updateExpenseSchema = Joi.object({
    amount: Joi.number().positive(),
    date: Joi.date(),
    description: Joi.string().allow(null, '').trim(),
    categoryId: Joi.number().integer(),
    paymentMethodId: Joi.number().integer(),
});

export {
    createExpenseSchema,
    updateExpenseSchema
}