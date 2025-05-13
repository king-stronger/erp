import Joi from "joi";
import prisma from "../utils/prisma.js";

async function getAllRevenues(req, res, next){
    try {
        const revenues = await prisma.revenue.findMany({
            orderBy: {
                date: "desc"
            },
            select: {
                id: true,
                date: true,
                amount: true,
                description: true
            },
            include: {
                category: {
                    select: {
                        name: true
                    }
                },
                paymentMethod: {
                    select: {
                        name: true
                    }
                }
            }
        });

        if(revenues.length === 0) return res.json({ message: "No revenues found" });

        return res.json({ revenues });
    } catch (error){
        return next(error);
    }
}

async function createRevenue(req, res, next){
    try {
        const categories = await prisma.category.findMany({
            select: {
                id: true,
                name: true
            }
        });
    
        return res.json({ message: "Render revenue creation form", categories });
    } catch(error){
        return next(error);
    }
}

async function editRevenue(req, res, next){
    try {
        const id = parseInt(req.params.id);
        
        if(isNaN(id)) return res.json({ message: "Invalid Id" });

        const revenue = await prisma.revenue.findUnique({
            where: { id },
            select: { id: true }
        });

        if(!revenue) return res.json({ message: "Revenue not found" });

        const categories = await prisma.category.findMany({
            select : {
                id: true,
                name: true
            }
        });
        
        return res.json({ message: "Render revenue creation form", revenue, categories });
    } catch (error){
        return next(error);
    }
}

async function storeRevenue(req, res, next){
    try {
        if(!req.body && Object.keys(req.body).length === 0){
            return res.json({ message: "No data received" });
        }

        const schema = Joi.object({
            amount: Joi.number().required(),
            description: Joi.string().required(),
            categoryId: Joi.number().required(),
            paymentMethodId: Joi.number().required(),
            date: Joi.date().required()
        });

        const { error, value } = schema.validate(req.body, { abortEarly: false });

        if(error) return res.json({ error });

        const { amount, description, categoryId, date, paymentMethodId } = value;

        const [ existingCategory, existingPaymentMethod ] = await Promise.all([
            prisma.category.findUnique({
                where: { id: categoryId },
                select: { id: true } }),
            prisma.paymentMethod.findUnique({
                where: { id: paymentMethodId },
                select: { id: true }
            }),
        ]);

        if(!existingCategory || !existingPaymentMethod) return res.json({ message: "Invalid category or payment method"});

        const newRevenue = await prisma.revenue.create({
            data: {
                amount,
                description,
                date,
                categoryId,
                paymentMethodId,
                createdById: req.user.id
            }
        });

        return res.json({ message: "Revenue successfully created", newRevenue });
    } catch (error){
        return next(error);
    }
}

async function updateRevenue(req, res, next){
    try {
        const id = parseInt(req.params.id);
        
        if(isNaN(id)) return res.json({ message: "Invalid Id" });

        const schema = Joi.object({
            amount: Joi.number().positive(),
            date: Joi.date(),
            description: Joi.string().allow(null, ''),
            categoryId: Joi.number().integer(),
            paymentMethodId: Joi.number().integer(),
        });

        const { error, value } = schema.validate(req.body, { abortEarly: false });

        if(error) return res.json({ error });

        const { amount, description, categoryId, date, paymentMethodId } = value;

        const [ existingCategory, existingPaymentMethod, existingRevenue ] = await Promise.all([
            prisma.category.findUnique({
                where: { id: categoryId },
                select: { id: true }}),
            prisma.paymentMethod.findUnique({
                where: { id: paymentMethodId },
                select: { id: true }
            }),
            prisma.revenue.findUnique({
                where: { id },
                select: { id: true }
            })
        ]);

        if(
            !existingRevenue ||
            !existingCategory ||
            !existingPaymentMethod
        ) return res.json({ message: "Category or payment method or revenue doesn't exist"});
        
        const updatedRevenue = await prisma.revenue.update({
            where: { id },
            data: value 
        });

        return res.json({ message: "Revenue successfully updated", updatedRevenue });
    } catch (error){
        return next(error);
    }
}

async function deleteRevenue(req, res, next){
    try {
        const id = parseInt(req.params.id);
        
        if(isNaN(id)) return res.json({ message: "Invalid Id" });

        const existingRevenue = await prisma.revenue.findUnique({
            where: { id },
            select: { id: true }
        });

        if(!existingRevenue) return res.json({ message: "Revenue not found" });

        await prisma.revenue.delete({ where: { id }});

        return res.json({ message: "Revenue successfully deleted" });
    } catch (error){
        return next(error);
    }
}

export {
    getAllRevenues,
    createRevenue,
    editRevenue,
    storeRevenue,
    updateRevenue,
    deleteRevenue
}