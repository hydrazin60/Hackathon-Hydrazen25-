import express from "express";
import {
  createLongQuestion,
  deleteLongQuestion,
  getAllLongQuestion,
  updateLongQuestion,
} from "../../controller/Question/LongQuestion.controller.js";
import isAuthenticated from "../../middlewares/isAuthenticated.js";
import { UploadImage } from "../../middlewares/multer.js";
import {
  createMCQQuestion,
  DeleteMCQQuestion,
  getAllMCQQuestion,
  updateMCQQuestion,
} from "../../controller/Question/MCQ.controller.js";

const questionRouter = express.Router();

// Route for uploading long questions with imageQuestion and imageAnswer fields
questionRouter.post(
  "/upload_question",
  UploadImage.fields([
    { name: "imageQuestion", maxCount: 5 }, // Form-data key: "imageQuestion"
    { name: "imageAnswer", maxCount: 5 }, // Form-data key: "imageAnswer"
  ]),
  isAuthenticated,
  createLongQuestion
);
questionRouter.put(
  "/update_long_question/:id",
  UploadImage.fields([
    { name: "imageQuestion", maxCount: 5 }, // Form-data key: "imageQuestion"
    { name: "imageAnswer", maxCount: 5 }, // Form-data key: "imageAnswer"
  ]),
  isAuthenticated,
  updateLongQuestion
);

// Route for uploading MCQ questions with optional imageAnswer field
questionRouter.post(
  "/upload_mcq_question",
  UploadImage.fields([{ name: "imageAnswer", maxCount: 1 }]),

  isAuthenticated,
  createMCQQuestion
);

questionRouter.delete(
  "/delete_mcq_question/:id",
  isAuthenticated,
  DeleteMCQQuestion
);

questionRouter.get("/get_all_questions", getAllMCQQuestion);
questionRouter.put(
  "/update_mcq_question/:id",
  UploadImage.fields([{ name: "imageAnswer", maxCount: 1 }]),
  isAuthenticated,
  updateMCQQuestion
);
questionRouter.get("/get_all_questions", getAllLongQuestion);
questionRouter.delete(
  "/delete_long_question/:id",
  isAuthenticated,
  deleteLongQuestion
);

export default questionRouter;
