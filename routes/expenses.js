import { Router } from "express";
import {
    createExpense,
    deleteExpense,
    editExpense,
    getAllExpenses,
    storeExpense,
    updateExpense
} from "../controllers/expense.js";

const expenseRouter = Router();

expenseRouter.get("/", getAllExpenses);
expenseRouter.get("/new", createExpense);
expenseRouter.get("/:id/edit", editExpense);
expenseRouter.post("/", storeExpense);
expenseRouter.put("/:id", updateExpense);
expenseRouter.delete("/:id", deleteExpense);

export default expenseRouter;