import { Router } from "express";
import {
    createPayment,
    deletePayment,
    editPayment,
    getAllPayments,
    storePayment,
    updatePayment
} from "../controllers/payment.js";
import {
    createPaymentSchema,
    updatePaymentSchema
} from "../validations/payment.js";
import { validate } from "../middlewares/validation.js";

const paymentRouter = Router();

paymentRouter.get("/", getAllPayments);
paymentRouter.get("/new", createPayment);
paymentRouter.get("/:id/edit", editPayment);
paymentRouter.delete("/:id", deletePayment);
paymentRouter.post("/", validate(createPaymentSchema), storePayment);
paymentRouter.put("/:id", validate(updatePaymentSchema), updatePayment);

export default paymentRouter;