import { Router } from "express";
import {
    createRevenue,
    deleteRevenue,
    editRevenue,
    getAllRevenues,
    storeRevenue,
    updateRevenue
} from "../controllers/revenue.js";
import {
    createRevenueSchema,
    updateRevenueSchema
} from "../validations/revenue.js";
import { validate } from "../utils/validation.js";

const revenueRouter = Router();

revenueRouter.get("/", getAllRevenues);
revenueRouter.get("/new", createRevenue);
revenueRouter.delete("/:id", deleteRevenue);
revenueRouter.get("/:id/edit", editRevenue);
revenueRouter.post("/", validate(createRevenueSchema), storeRevenue);
revenueRouter.put("/:id", validate(updateRevenueSchema), updateRevenue);

export default revenueRouter;