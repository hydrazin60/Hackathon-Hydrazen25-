import express from "express";
import { RegisterUser, VerifyUser } from "../../controller/user.controller.js";
const userRouter = express.Router();

userRouter.post("/register", RegisterUser);
userRouter.get("/verify/:token", VerifyUser);

export default userRouter;
