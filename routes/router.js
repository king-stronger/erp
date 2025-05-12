import { Router } from "express";
import authRouter from "./auth.js";
import paymentRouter from "./payments.js";
import categoryRouter from "./categories.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/payments", paymentRouter);
router.use("/categories", categoryRouter);

export default router;