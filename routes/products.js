import { Router } from "express";
import {
    createProduct,
    deleteProduct,
    editProduct,
    getAllProducts,
    storeProduct,
    updateProduct
} from "../controllers/product.js";

const productRouter = Router();

productRouter.get("/", getAllProducts);
productRouter.post("/", storeProduct);
productRouter.get("/new", createProduct);
productRouter.put("/:id", updateProduct);
productRouter.delete("/:id", deleteProduct);
productRouter.get("/:id/edit", editProduct);

export default productRouter;