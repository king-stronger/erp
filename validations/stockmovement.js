import Joi from "joi";

const createStockMovementSchema = Joi.object({
    productId: Joi.number().positive().required(),
    movementType: Joi.string().valid('IN', 'OUT').required(),
    quantity: Joi.number().positive().required(),
    reason: Joi.string().allow(null, ''),
    source: Joi.string().valid(
        'ACHAT', 'VENTE', 'PERTE', 'DON', 'INVENTAIRE', 'RETOUR_CLIENT'
    ).required(),
    date: Joi.date().required()
});

const updateStockMovementSchema = Joi.object({
    productId: Joi.number().positive(),
    movementType: Joi.string().valid('IN', 'OUT'),
    quantity: Joi.number().positive(),
    reason: Joi.string().allow(null, ''),
    source: Joi.string().valid(
        'ACHAT', 'VENTE', 'PERTE', 'DON', 'INVENTAIRE', 'RETOUR_CLIENT'
    ),
    date: Joi.date()
});

export {
    createStockMovementSchema,
    updateStockMovementSchema
}