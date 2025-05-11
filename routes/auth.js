import { Router } from "express";
import { login, logout, register } from "../controllers/auth.js";

const authRouter = Router();

authRouter.get("/login", login);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.get("/register", register);
authRouter.post("/register", register);

export default authRouter;