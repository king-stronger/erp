import { Router } from "express";
import {
    login,
    logout,
    register
} from "../controllers/auth.js";
import {
    isAuthenticated,
    isNotAuthenticated
} from "../middlewares/authentication.js";
import { validate } from "../middlewares/validation.js";
import { registerSchema } from "../validations/auth.js";

const authRouter = Router();

authRouter.get("/login", isNotAuthenticated, login);
authRouter.post("/login", isNotAuthenticated, login);
authRouter.post("/logout", isAuthenticated, logout);
authRouter.get("/register", isNotAuthenticated, register);
authRouter.post("/register", isNotAuthenticated, validate(registerSchema), register);

export default authRouter;