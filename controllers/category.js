import prisma from "../utils/prisma.js";

async function getAllCategories(req, res, next){
    try {
        const categories = await prisma.category.findMany({
            select: {
                id: true,
                name: true,
                type: true
            }
        });

        if(categories.length === 0) return res.json({ message: "Categories not found" });

        return res.json({ categories });
    } catch(error){
        return next(error);
    }
}

async function createCategory(req, res, next){
    return res.json({ message: "Render category creation form" });
}

async function editCategory(req, res, next){
    try {
        const id = parseInt(req.params.id);
    
        if(isNaN(id)) return res.json({ message: "Invalid Id" });
    
        const category = await prisma.category.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                type: true
            }
        });
    
        if(!category) return res.json({ message: "Category doesn't exist" });
        
        return res.json({ message: "Render category edition form", category});
    } catch (error){
        return next(error);
    }
}

async function storeCategory(req, res, next){
    try {
        if (Object.keys(req.body).length === 0) {
            return res.status(400).json({ message: "No data received" });
        }
    
        const existingCategory = await prisma.category.findFirst({
            where: req.validatedBody,
            select: { id: true } 
        });
    
        if(existingCategory) return res.json({ message: "Category already exists" });
    
        const category = await prisma.category.create({ data: req.validatedBody });
    
        return res.json({ category });
    } catch (error){
        return next(error);
    }
}

async function updateCategory(req, res, next){
    try {
        if (Object.keys(req.body).length === 0) {
            return res.status(400).json({ message: "No data received" });
        }
    
        const id = parseInt(req.params.id);
    
        if(isNaN(id)) return res.json({ message: "Invalid Id" });
    
        const [ foundCategory, existingCategory ] = await Promise.all([
            prisma.category.findUnique({
                where: { id },
                select: { id: true }
            }),
            prisma.category.findFirst({
                where: req.validatedBody,
                select: { id: true }
            })
        ]);
    
        if(!foundCategory) return res.json({ message: "Category doesn't exist" });
        if(existingCategory) return res.json({ message: "Category already exists" });

        const newCategory = await prisma.category.update({
            where: { id },
            data: req.validatedBody
        });
    
        return res.json({ newCategory });
    } catch (error){
        return next(error);
    }
}

async function deleteCategory(req, res, next){
    try {
        const id = parseInt(req.params.id);
    
        if(isNaN(id)) return res.json({ message: "Invalid Id" });
    
        const foundCategory = await prisma.category.findUnique({
            where: { id },
            select: { id: true }
        });
    
        if(!foundCategory) return res.json({ message: "Category doesn't exist" });
    
        await prisma.category.delete({ where: { id } });

        return res.json({ message: "Category was successfully deleted" });
    } catch (error){
        return next(error);
    }
}

export {
    getAllCategories,
    createCategory,
    editCategory,
    storeCategory,
    updateCategory,
    deleteCategory
}