import Joi from "joi";

const createCategorySchema = Joi.object({
    name: Joi.string().trim().required(),
    type: Joi.string().trim().valid("EXPENSE", "REVENUE", "PRODUCT").required()
});

const updateCategorySchema = Joi.object({
    name: Joi.string().trim(),
    type: Joi.string().trim().valid("EXPENSE", "REVENUE", "PRODUCT")
});

export {
    createCategorySchema,
    updateCategorySchema
}