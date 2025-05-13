import Joi from "joi";
import prisma from "../utils/prisma.js";

async function getAllExpenses(req, res, next){
    try {
        const expenses = await prisma.expense.findMany({
            orderBy: {
                date: "desc"
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

        if(expenses.length === 0) return res.json({ message: "No expenses found" });

        return res.json({ expenses });
    } catch (error){
        return next(error);
    }
}

async function createExpense(req, res, next){
    try {
        const categories = await prisma.category.findMany({
            select: {
                id: true,
                name: true
            }
        });
    
        return res.json({ message: "Render expense creation form", categories });
    } catch(error){
        return next(error);
    }
}

async function editExpense(req, res, next){
    try {
        const id = parseInt(req.params.id);
        
        if(isNaN(id)) return res.json({ message: "Invalid Id" });

        const expense = await prisma.expense.findUnique({ where: { id } });

        if(!expense) return res.json({ message: "Expense not found" });

        const categories = await prisma.category.findMany({
            select : {
                id: true,
                name: true
            }
        });
        
        return res.json({ message: "Render expense creation form", expense, categories });
    } catch (error){
        return next(error);
    }
}

async function storeExpense(req, res, next){
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
            prisma.category.findUnique({ where: { id: categoryId }}),
            prisma.paymentMethod.findUnique({ where: { id: paymentMethodId }}),
        ]);

        if(!existingCategory || !existingPaymentMethod) return res.json({ message: "Invalid category or payment method"});

        const newExpense = await prisma.expense.create({
            data: {
                amount,
                description,
                date,
                categoryId,
                paymentMethodId,
                createdById: req.user.id
            }
        });

        return res.json({ message: "Expense successfully created", newExpense });
    } catch (error){
        return next(error);
    }
}

async function updateExpense(req, res, next){
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

        const [ existingCategory, existingPaymentMethod, existingExpense ] = await Promise.all([
            prisma.category.findUnique({ where: { id: categoryId }}),
            prisma.paymentMethod.findUnique({ where: { id: paymentMethodId }}),
            prisma.expense.findUnique({ where: { id } })
        ]);

        if(
            !existingExpense ||
            !existingCategory ||
            !existingPaymentMethod
        ) return res.json({ message: "Category or payment method or expense doesn't exist"});
        
        const updatedExpense = await prisma.expense.update({
            where: { id },
            data: value 
        });

        return res.json({ message: "Expense successfully updated", updatedExpense });
    } catch (error){
        return next(error);
    }
}

async function deleteExpense(req, res, next){
    try {
        const id = parseInt(req.params.id);
        
        if(isNaN(id)) return res.json({ message: "Invalid Id" });

        const existingExpense = await prisma.expense.findUnique({ where: { id } });

        if(!existingExpense) return res.json({ message: "Expense not found" });

        await prisma.expense.delete({ where: { id }});

        return res.json({ message: "Expense successfully deleted" });
    } catch (error){
        return next(error);
    }
}

export {
    getAllExpenses,
    createExpense,
    editExpense,
    storeExpense,
    updateExpense,
    deleteExpense
}