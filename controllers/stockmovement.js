import prisma from "../utils/prisma.js";

async function getAllStockMovements(req, res, next){
    try {
        const stockmovements = await prisma.stockMovement.findMany({
            include: {
                product: {
                    select: { id: true, name: true }
                }
            }
        });

        if(stockmovements.length === 0) return res.json({ message: "No stockmovement found" });

        return res.json({ stockmovements });
    } catch (error){
        return next(error);
    }
}

async function createStockMovement(req, res, next){
    try {
        const products = await prisma.product.findMany({
            select: {
                id: true,
                name: true
            }
        });

        if(products.length === 0) return res.json({ message: "No products found" });

        return res.json({ message: "Render stock movement creation form", products });
    } catch (error){
        return next(error);
    }
}

async function editStockMovement(req, res, next){
    try {
        const id = parseInt(req.params.id);

        if(isNaN(id)) return res.json({ message: "invalid Id" });

        const [ stockMovement, products ] = await Promise.all([
            prisma.stockMovement.findUnique({
                where: { id },
                select: {
                    id: true,
                    date: true,
                    source: true,
                    reason: true,
                    quantity: true,
                    productId: true,
                    movementType: true
                }
            }),
            prisma.product.findMany({
                select: {
                    id: true,
                    name: true
                }
            })
        ]);

        if(!stockMovement) return res.json({ message: "Stock movement not found" });
        if(products.length === 0) return res.json({ message: "No products found" });

        return res.json({ message: "Render stock movement edition form", stockMovement, products });
    } catch (error){
        return next(error);
    }
}

async function storeStockMovement(req, res, next){
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.json({ message: "No data was received" });
        }

        const { productId, quantity, movementType } = req.validatedBody;

        let newStockMovement;

        await prisma.$transaction(async (tx) => {
            const product = await tx.product.findUnique({ where: { id: productId } });
            if (!product) throw new Error("Product not found");

            let newStock;
            if (movementType === "IN") {
                newStock = product.currentStock + quantity;
            } else if (movementType === "OUT") {
                newStock = product.currentStock - quantity;
                if (newStock < 0) throw new Error("Stock cannot be negative");
            } else {
                throw new Error("Invalid movement type");
            }

            await tx.product.update({
                where: { id: productId },
                data: { currentStock: newStock }
            });

            newStockMovement = await tx.stockMovement.create({
                data: {
                    ...req.validatedBody,
                    createdById: req.user.id
                }
            });
        });

        return res.json({ message: "StockMovement successfully created", newStockMovement });
    } catch (error) {
        return next(error);
    }
}

async function updateStockMovement(req, res, next) {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.json({ message: "No data was received" });
        }

        const id = parseInt(req.params.id);
        if (isNaN(id)) return res.json({ message: "Invalid Id" });

        let updatedStockMovement;

        await prisma.$transaction(async (tx) => {
            const existing = await tx.stockMovement.findUnique({ where: { id } });
            if (!existing) throw new Error("StockMovement not found");

            const product = await tx.product.findUnique({ where: { id: existing.productId } });
            if (!product) throw new Error("Product not found");

            // 1. Restaurer le stock comme si le mouvement n’avait jamais eu lieu
            let restoredStock = product.currentStock;
            if (existing.movementType === "IN") {
                restoredStock -= existing.quantity;
            } else if (existing.movementType === "OUT") {
                restoredStock += existing.quantity;
            }

            // 2. Appliquer la nouvelle modification
            const { quantity, movementType } = req.validatedBody;

            let finalStock = restoredStock;
            if (movementType === "IN") {
                finalStock += quantity;
            } else if (movementType === "OUT") {
                finalStock -= quantity;
                if (finalStock < 0) throw new Error("Stock cannot be negative");
            } else {
                throw new Error("Invalid movement type");
            }

            // 3. Mettre à jour le stock
            await tx.product.update({
                where: { id: existing.productId },
                data: { currentStock: finalStock }
            });

            // 4. Mettre à jour le mouvement
            updatedStockMovement = await tx.stockMovement.update({
                where: { id },
                data: req.validatedBody
            });
        });

        return res.json({ message: "StockMovement successfully updated", updatedStockMovement });
    } catch (error) {
        return next(error);
    }
}

async function deleteStockMovement(req, res, next) {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) return res.json({ message: "Invalid Id" });

        await prisma.$transaction(async (tx) => {
            const movement = await tx.stockMovement.findUnique({ where: { id } });
            if (!movement) throw new Error("StockMovement not found");

            const product = await tx.product.findUnique({ where: { id: movement.productId } });
            if (!product) throw new Error("Product not found");

            // Annuler l'effet du mouvement
            let newStock = product.currentStock;
            if (movement.movementType === "IN") {
                newStock -= movement.quantity;
                if (newStock < 0) throw new Error("Cannot delete: stock would become negative");
            } else if (movement.movementType === "OUT") {
                newStock += movement.quantity;
            } else {
                throw new Error("Invalid movement type");
            }

            // Mettre à jour le stock
            await tx.product.update({
                where: { id: movement.productId },
                data: { currentStock: newStock }
            });

            // Supprimer le mouvement
            await tx.stockMovement.delete({ where: { id } });
        });

        return res.json({ message: "StockMovement successfully deleted" });
    } catch (error) {
        return next(error);
    }
}

export {
    getAllStockMovements,
    createStockMovement,
    editStockMovement,
    storeStockMovement,
    updateStockMovement,
    deleteStockMovement
}