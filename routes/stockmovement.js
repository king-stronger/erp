import { Router } from "express";
import {
    createStockMovementSchema,
    updateStockMovementSchema
} from "../validations/stockmovement.js";
import {
    createStockMovement,
    deleteStockMovement,
    editStockMovement,
    getAllStockMovements,
    storeStockMovement,
    updateStockMovement
} from "../controllers/stockmovement.js";
import { validate } from "../middlewares/validation.js";



const stockmovementRouter = Router();

stockmovementRouter.get("/", getAllStockMovements);
stockmovementRouter.get("/new", createStockMovement);
stockmovementRouter.get("/:id/edit", editStockMovement);
stockmovementRouter.delete("/:id", deleteStockMovement);
stockmovementRouter.post("/", validate(createStockMovementSchema), storeStockMovement);
stockmovementRouter.put("/:id", validate(updateStockMovementSchema), updateStockMovement);

export default stockmovementRouter;