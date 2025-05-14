import { Router } from "express";
import {
    createPayment,
    deletePayment,
    editPayment,
    getAllPayments,
    storePayment,
    updatePayment
} from "../controllers/payment.js";
import { validate } from "../utils/validation.js";
import {
    createPaymentSchema,
    updatePaymentSchema
} from "../validations/payment.js";

const paymentRouter = Router();

paymentRouter.get("/", getAllPayments);
paymentRouter.get("/new", createPayment);
paymentRouter.get("/:id/edit", editPayment);
paymentRouter.post("/", validate(createPaymentSchema), storePayment);
paymentRouter.put("/:id", updatePayment);
paymentRouter.delete("/", validate(updatePaymentSchema), deletePayment);

export default paymentRouter;