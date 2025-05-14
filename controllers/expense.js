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

        const expense = await prisma.expense.findUnique({
            where: { id },
            select: {
                id: true,
                date: true,
                amount: true,
                description: true,
                categoryId: true,
                paymentMethodId: true
            }
        });

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
        if(!req.body || Object.keys(req.body).length === 0){
            return res.json({ message: "No data received" });
        }

        const { categoryId, paymentMethodId } = req.validatedBody;

        const [ existingCategory, existingPaymentMethod ] = await Promise.all([
            prisma.category.findUnique({
                where: { id: categoryId },
                select: { id: true }}
            ),
            prisma.paymentMethod.findUnique({
                where: { id: paymentMethodId },
                select: { id: true }
            }),
        ]);

        if(!existingCategory) return res.json({ message: "Invalid category method"});
        if(!existingPaymentMethod) return res.json({ message: "Invalid payment method"});

        const newExpense = await prisma.expense.create({
            data: {
                ...req.validatedBody,
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
        if(!req.body || Object.keys(req.body).length === 0){
            return res.json({ message: "No data received" });
        }

        const id = parseInt(req.params.id);
        
        if(isNaN(id)) return res.json({ message: "Invalid Id" });

        const { categoryId, paymentMethodId } = req.validatedBody;

        const [ existingCategory, existingPaymentMethod, existingExpense ] = await Promise.all([
            prisma.category.findUnique({
                where: { id: categoryId },
                select: { id: true } }),
            prisma.paymentMethod.findUnique({
                where: { id: paymentMethodId },
                select: { id: true }
            }),
            prisma.expense.findUnique({
                where: { id },
                select: { id: true }
            })
        ]);

        if(!existingExpense) return res.json({ message: "expense doesn't exist"});
        if(!existingCategory) return res.json({ message: "Category doesn't exist"});
        if(!existingPaymentMethod) return res.json({ message: "Payment method doesn't exist"});
        
        const updatedExpense = await prisma.expense.update({
            where: { id },
            data: req.validatedBody 
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

        const existingExpense = await prisma.expense.findUnique({
            where: { id },
            select: { id: true }
        });

        if(!existingExpense) return res.json({ message: "Expense not found" });

        await prisma.expense.delete({ where: { id } });

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