import { Router } from "express";
import authRouter from "./auth.js";
import paymentRouter from "./payments.js";
import revenueRouter from "./revenues.js";
import expenseRouter from "./expenses.js";
import productRouter from "./products.js";
import categoryRouter from "./categories.js";
import stockmovementRouter from "./stockmovements.js";
import { isAuthenticated } from "../middlewares/authentication.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/payments", isAuthenticated, paymentRouter);
router.use("/revenues", isAuthenticated, revenueRouter);
router.use("/expenses", isAuthenticated, expenseRouter);
router.use("/products", isAuthenticated, productRouter);
router.use("/categories", isAuthenticated, categoryRouter);
router.use("/stockmovements", isAuthenticated, stockmovementRouter);

export default router;