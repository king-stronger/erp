import { Router } from "express";
import {
    createCategory,
    deleteCategory,
    editCategory,
    getAllCategories,
    storeCategory,
    updateCategory
} from "../controllers/category.js";

const categoryRouter = Router();

categoryRouter.get("/", getAllCategories);
categoryRouter.get("/new", createCategory);
categoryRouter.get("/:id/edit", editCategory);
categoryRouter.post("/", storeCategory);
categoryRouter.put("/:id", updateCategory);
categoryRouter.delete("/:id", deleteCategory);

export default categoryRouter;