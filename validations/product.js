import Joi from "joi";

const createProductschema = Joi.object({
    name: Joi.string().trim().required(),
    description: Joi.string().allow(null, '').trim(),
    unit: Joi.string().trim().required(),
    priceUnit: Joi.number().positive().allow(null),
    initialStock: Joi.number().min(0).default(0),
    currentStock: Joi.number().min(0).default(0),
    alertTreshold: Joi.number().min(0).default(0),
    categoryId: Joi.number().integer().required()
});

const updateProductschema = Joi.object({
    name: Joi.string().trim(),
    description: Joi.string().allow(null, '').trim(),
    unit: Joi.string().trim(),
    priceUnit: Joi.number().positive().allow(null),
    initialStock: Joi.number().min(0),
    currentStock: Joi.number().min(0),
    alertTreshold: Joi.number().min(0),
    categoryId: Joi.number().integer()
});

export {
    createProductschema,
    updateProductschema
}