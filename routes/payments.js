import { Router } from "express";
import {
    createPayment,
    deletePayment,
    editPayment,
    getAllPayments,
    storePayment,
    updatePayment
} from "../controllers/payment.js";

const paymentRouter = Router();

paymentRouter.get("/", getAllPayments);
paymentRouter.get("/new", createPayment);
paymentRouter.get("/:id/edit", editPayment);
paymentRouter.post("/", storePayment);
paymentRouter.put("/:id", updatePayment);
paymentRouter.delete("/", deletePayment);

export default paymentRouter;