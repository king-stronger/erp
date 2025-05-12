import { Router } from "express";
import authRouter from "./auth.js";
import categoryRouter from "./categories.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/categories", categoryRouter);

export default router;