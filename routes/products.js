import { Router } from "express";
import {
    createProduct,
    deleteProduct,
    editProduct,
    getAllProducts,
    storeProduct,
    updateProduct
} from "../controllers/product.js";
import {
    createProductschema,
    updateProductschema
} from "../validations/product.js";
import { validate } from "../utils/validation.js";

const productRouter = Router();

productRouter.get("/", getAllProducts);
productRouter.get("/new", createProduct);
productRouter.delete("/:id", deleteProduct);
productRouter.get("/:id/edit", editProduct);
productRouter.post("/", validate(createProductschema), storeProduct);
productRouter.put("/:id", validate(updateProductschema), updateProduct);

export default productRouter;