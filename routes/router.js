import { Router } from "express";
import authRouter from "./auth.js";
import paymentRouter from "./payments.js";
import categoryRouter from "./categories.js";
import { isAuthenticated } from "../middlewares/authentication.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/payments", isAuthenticated, paymentRouter);
router.use("/categories", isAuthenticated, categoryRouter);

export default router;