import prisma from "../utils/prisma.js";

async function getAllRevenues(req, res, next){
    try {
        const revenues = await prisma.revenue.findMany({
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
            select: {
                id: true,
                date: true,
                amount: true,
                description: true,
                categoryId: true,
                paymentMethodId: true
            }
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
        if(!req.body || Object.keys(req.body).length === 0){
            return res.json({ message: "No data received" });
        }

        const { categoryId, paymentMethodId } = req.validatedBody;

        const [ existingCategory, existingPaymentMethod ] = await Promise.all([
            prisma.category.findUnique({
                where: { id: categoryId },
                select: { id: true } }),
            prisma.paymentMethod.findUnique({
                where: { id: paymentMethodId },
                select: { id: true }
            }),
        ]);

        if(!existingCategory) return res.json({ message: "Category doesn't exist"});
        if(!existingPaymentMethod) return res.json({ message: "Payment method doesn't exist"});

        const newRevenue = await prisma.revenue.create({
            data: {
                ...req.validatedBody,
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
        if(!req.body || Object.keys(req.body).length === 0){
            return res.json({ message: "No data received" });
        }

        const id = parseInt(req.params.id);
        
        if(isNaN(id)) return res.json({ message: "Invalid Id" });

        const { categoryId, paymentMethodId } = req.validatedBody;

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

        if(!existingRevenue) return res.json({ message: "Revenue doesn't exist"});
        if(!existingCategory) return res.json({ message: "Category doesn't exist"});
        if(!existingPaymentMethod) return res.json({ message: "Payment method doesn't exist"});
        
        const updatedRevenue = await prisma.revenue.update({
            where: { id },
            data: req.validatedBody 
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