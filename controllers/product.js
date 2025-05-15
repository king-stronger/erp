import Joi from "joi";
import prisma from "../utils/prisma.js";

async function getAllProducts(req, res, next){
    try {
        const products = await prisma.product.findMany({
            include: {
                category: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });

        if(products.length === 0) return res.json({ message: "No product found" });

        return res.json({ products });
    } catch (error){
        return next(error);
    }
}

async function createProduct(req, res, next){
    try {
        const categories = await prisma.category.findMany({
            select: {
                id: true,
                name: true
            }
        });

        if(categories.length === 0) return res.json({ message: "No categories found" });

        return res.json({ message: "Render product creation form", categories });
    } catch (error){
        return next(error);
    }
}

async function editProduct(req, res, next){
    try {
        const id = parseInt(req.params.id);

        if(isNaN(id)) return res.json({ message: "invalid Id" });

        const [ product, categories ] = await Promise.all([
            prisma.product.findUnique({
                where: { id },
                select: {
                    id: true,
                    name: true,
                    description: true,
                    unit: true,
                    priceUnit: true,
                    initialStock: true,
                    currentStock: true,
                    alertTreshold: true,
                    categoryId: true
                }
            }),
            prisma.category.findMany({
                select: {
                    id: true,
                    name: true
                }
            })
        ]);

        if(!product) return res.json({ message: "Product not found" });
        if(categories.length === 0) return res.json({ message: "No categories found" });

        return res.json({ message: "Render product edition form", product, categories });
    } catch (error){
        return next(error);
    }
}

async function storeProduct(req, res, next){
    try {
        const { categoryId } = req.validatedBody;

        const existingCategory = await prisma.category.findUnique({
            where: { id: categoryId },
            select: { id: true }
        });
        if(!existingCategory) return res.json({ message: "Invalid category"});

        const newProduct = await prisma.product.create({ data: req.validatedBody });

        return res.json({ message: "Product successfully created", newProduct });
    } catch (error){
        return next(error);
    }
}

async function updateProduct(req, res, next){
    try {
        const id = parseInt(req.params.id);

        if(isNaN(id)) return res.json({ message: "invalid Id" });

        const { categoryId } = req.validatedBody;

        const [ existingCategory, existingProduct ] = await Promise.all([
            prisma.category.findUnique({
                where: { id: categoryId },
                select: { id: true }
            }),
            prisma.product.findUnique({
                where: { id },
                select: { id: true }
            })
        ]);

        if(!existingCategory) return res.json({ message: "Invalid category"});
        if(!existingProduct) return res.json({ message: "Product not found" });
        
        const updatedProduct = await prisma.product.update({
            where: { id },
            data: req.validatedBody
        });

        return res.json({ message: "Product successfully updated", updatedProduct });
    } catch (error){
        return next(error);
    }
}

async function deleteProduct(req, res, next){
    try {
        const id = parseInt(req.params.id);

        if(isNaN(id)) return res.json({ message: "invalid Id" });

        const product = await prisma.product.findUnique({
            where: { id },
            select: { id: true }
        });

        if(!product) return res.json({ message: "Product not found" });

        await prisma.product.delete({ where: { id }});

        return res.json({ message: "Product successfully deleted "});
    } catch (error){
        return next(error);
    }
}

export {
    getAllProducts,
    createProduct,
    editProduct,
    storeProduct,
    updateProduct,
    deleteProduct
}