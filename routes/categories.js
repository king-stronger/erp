import { Router } from "express";
import {
    createCategory,
    deleteCategory,
    editCategory,
    getAllCategories,
    storeCategory,
    updateCategory
} from "../controllers/category.js";
import { 
    createCategorySchema,
    updateCategorySchema
} from "../validations/category.js";
import { validate } from "../utils/validation.js";

const categoryRouter = Router();

categoryRouter.get("/", getAllCategories);
categoryRouter.get("/new", createCategory);
categoryRouter.get("/:id/edit", editCategory);
categoryRouter.delete("/:id", deleteCategory);
categoryRouter.post("/", validate(createCategorySchema), storeCategory);
categoryRouter.put("/:id", validate(updateCategorySchema), updateCategory);

export default categoryRouter;