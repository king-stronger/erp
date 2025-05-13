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
                select: { id: true }
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
        if(!req.body && Object.keys(req.body).length === 0){
            return res.json({ message: "No data was received" });
        }

        const schema = Joi.object({
            name: Joi.string().required(),
            description: Joi.string().allow(null, ''),
            unit: Joi.string().required(),
            priceUnit: Joi.number().positive().allow(null),
            initialStock: Joi.number().min(0).default(0),
            alertTreshold: Joi.number().min(0).default(0),
            categoryId: Joi.number().integer().required()
        });

        const { error, value } = schema.validate(req.body, { abortEarly: false });

        if(error) return res.json({ error });

        const { categoryId } = value;

        const existingCategory = await prisma.category.findUnique({
            where: { id: categoryId },
            select: { id: true }
        });
        if(!existingCategory) return res.json({ message: "Invalid category"});

        const newProduct = await prisma.product.create({ data: value });

        return res.json({ message: "Product successfully created", newProduct });
    } catch (error){
        return next(error);
    }
}

async function updateProduct(req, res, next){
    try {
        if(!req.body && Object.keys(req.body).length === 0){
            return res.json({ message: "No data was received" });
        }

        const id = parseInt(req.params.id);

        if(isNaN(id)) return res.json({ message: "invalid Id" });

        const schema = Joi.object({
            name: Joi.string(),
            description: Joi.string().allow(null, ''),
            unit: Joi.string(),
            priceUnit: Joi.number().positive().allow(null),
            initialStock: Joi.number().min(0),
            alertTreshold: Joi.number().min(0),
            categoryId: Joi.number().integer()
        })

        const { error, value } = schema.validate(req.body, { abortEarly: false });

        if(error) return res.json({ error });

        const { categoryId } = value;

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
            data: value
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