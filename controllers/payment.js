import Joi from "joi";
import prisma from "../utils/prisma.js";

async function getAllPayments(req, res, next){
    try {
        const payments = await prisma.paymentMethod.findMany({
            select: {
                id: true,
                name: true
            }
        });

        if(payments.length === 0) return res.json({ message: "No payment methods found"});

        return res.json({ payments });
    } catch (error){
        return next(error);
    }
}

async function createPayment(req, res, next){
    return res.json({ message: "Render payment method creation form"});
}

async function editPayment(req, res, next){
    try {
        const id = parseInt(req.params.id);
        
        if(isNaN(id)) return res.json({ message: "Invalid Id" });

        const payment = await prisma.paymentMethod.findUnique({
            where: { id },
            select: {
                id: true,
                name: true
            }
        });

        if(!payment) return res.json({ message: "Payment not found" });

        return res.json({ message: "Render payment method edition form", payment});
    } catch (error){
        return next(error);
    }
}

async function storePayment(req, res, next){
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.json({ message: "No data received" });
        }

        const schema = Joi.object({
            name: Joi.string().required()
        });
    
        const { error, value } = schema.validate(req.body, { abortEarly: false });
    
        if(error) return res.json({ error });

        const existingPaymentMethod = await prisma.paymentMethod.findFirst({
            where: { name: value.name },
            select: { id: true }
        });

        if(existingPaymentMethod) return res.json({ message: "Payment method already exists" });

        const newPayment = await prisma.paymentMethod.create({ data: value });

        return res.json({ newPayment });
    } catch (error){
        return next(error);
    }
}

async function updatePayment(req, res, next){
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.json({ message: "No data received" });
        }

        const id = parseInt(req.params.id);
        
        if(isNaN(id)) return res.json({ message: "Invalid Id" });

        const schema = Joi.object({
            name: Joi.string().required()
        });
    
        const { error, value } = schema.validate(req.body, { abortEarly: false });
    
        if(error) return res.json({ error });

        const [ foundPayment, existingPayment ] = await Promise.all([
            prisma.paymentMethod.findUnique({
                where: { id },
                select: { id: true }
            }),
            prisma.paymentMethod.findFirst({
                where: { name: value.name },
                select: { id: true }
            }),
        ])

        if(!foundPayment) return res.json({ message: "Payment not found" });
        if(existingPayment) return res.json({ message: "Payment already exists" });

        const updatedPayment = await prisma.paymentMethod.update({
            where: { id },
            data: value
        });
        
        return res.json({ message: "Payment method successfully updated", updatedPayment });
    } catch (error){
        return next(error);
    }
}

async function deletePayment(req, res, next){
    try {
        const id = parseInt(req.params.id);
        
        if(isNaN(id)) return res.json({ message: "Invalid Id" });

        const payment = await prisma.paymentMethod.findUnique({
            where: { id },
            select: { id: true }
        });

        if(!payment) return res.json({ message: "payment not found" });

        await prisma.paymentMethod.delete({ where: { id }});

        return res.json({ message: "Payment method successfully deleted"});
    } catch (error){
        return next(error);
    }
}

export {
    getAllPayments,
    createPayment,
    editPayment,
    storePayment,
    updatePayment,
    deletePayment
}