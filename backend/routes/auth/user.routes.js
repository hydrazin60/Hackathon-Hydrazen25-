import express from "express";
import { LoginUser, RegisterUser, VerifyUser } from "../../controller/user.controller.js";
const userRouter = express.Router();

userRouter.post("/register", RegisterUser);
userRouter.get("/verify/:token", VerifyUser);
userRouter.post("/login" , LoginUser)
export default userRouter;
