import { Router } from "express";
import {
    createRevenue,
    deleteRevenue,
    editRevenue,
    getAllRevenues,
    storeRevenue,
    updateRevenue
} from "../controllers/revenue.js";

const revenueRouter = Router();

revenueRouter.get("/", getAllRevenues);
revenueRouter.get("/new", createRevenue);
revenueRouter.get("/:id/edit", editRevenue);
revenueRouter.post("/", storeRevenue);
revenueRouter.put("/:id", updateRevenue);
revenueRouter.delete("/:id", deleteRevenue);

export default revenueRouter;