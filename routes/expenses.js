import { Router } from "express";
import {
    createExpense,
    deleteExpense,
    editExpense,
    getAllExpenses,
    storeExpense,
    updateExpense
} from "../controllers/expense.js";
import {
    createExpenseSchema,
    updateExpenseSchema
} from "../validations/expense.js";
import { validate } from "../middlewares/validation.js";

const expenseRouter = Router();

expenseRouter.get("/", getAllExpenses);
expenseRouter.get("/new", createExpense);
expenseRouter.get("/:id/edit", editExpense);
expenseRouter.delete("/:id", deleteExpense);
expenseRouter.post("/", validate(createExpenseSchema), storeExpense);
expenseRouter.put("/:id", validate(updateExpenseSchema), updateExpense);

export default expenseRouter;