import Joi from "joi";
import prisma from "../utils/prisma.js";
import { Categories } from "@prisma/client";

async function getAllCategories(req, res, next){
    try {
        const categories = await prisma.category.findMany();

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
    
        const category = await prisma.category.findUnique({ where: { id }});
    
        if(!category) return res.json({ message: "Category doesn't exist" });
        
        return res.json({ message: "Render category edition form", category});
    } catch (error){
        return next(error);
    }
}

async function storeCategory(req, res, next){
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ message: "No data received" });
        }
    
        const schema = Joi.object({
            name: Joi.string().required(),
            type: Joi.string().valid("EXPENSE", "REVENUE", "PRODUCT").required()
        });
    
        const { error, value } = schema.validate(req.body, { abortEarly: false });
    
        if(error) return res.json({ error });
    
        const existingCategory = await prisma.category.findFirst({ where: value });
    
        if(existingCategory) return res.json({ message: "Category already exists" });
    
        const category = await prisma.category.create({ data: value });
    
        return res.json({ category });
    } catch (error){
        return next(error);
    }
}

async function updateCategory(req, res, next){
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ message: "No data received" });
        }
    
        const id = parseInt(req.params.id);
    
        if(isNaN(id)) return res.json({ message: "Invalid Id" });

        const schema = Joi.object({
            name: Joi.string(),
            type: Joi.string().valid("EXPENSE", "REVENUE", "PRODUCT")
        });
        
        const { error, value } = schema.validate(req.body, { abortEarly: false });
    
        if(error) return res.json({ error });
    
        const [ foundCategory, existingCategory ] = await Promise.all([
            prisma.category.findUnique({ where: { id }}),
            prisma.category.findFirst({ where: value })
        ]);
    
        if(!foundCategory) return res.json({ message: "Category doesn't exist" });
        if(existingCategory) return res.json({ message: "Category already exists" });

        const newCategory = await prisma.category.update({
            where: { id },
            data: value
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
    
        const foundCategory = await prisma.category.findUnique({ where: { id }});
    
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