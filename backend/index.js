import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/auth/user.routes.js";
import internshipHUBrouter from "./routes/InternshipHub/ITcompany.routes.js";
import questionRouter from "./routes/Question/Question.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const MONGO_URL = process.env.MONGO_URL;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/v1/hackathon_hydrazen25/auth", userRouter);
app.use(
  "/api/v1/hackthon_hydrazen25/internshipHub/companies",
  internshipHUBrouter
);
app.use("/api/v1/hackthon_hydrazen25/internshipHub/questions", questionRouter);
app.listen(PORT, () => {
  try {
    console.log(`Server is running on port  ${PORT}`);
  } catch (error) {
    console.log(`Server is not running ${error.message}`);
  }
});

mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB", error);
  });
