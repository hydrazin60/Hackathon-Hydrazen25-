// import express from "express";
// import { createLongQuestion } from "../../controller/Question/LongQuestion.controller.js";
// import isAuthenticated from "../../middlewares/isAuthenticated.js";
// import { UploadImage } from "../../middlewares/multer.js";
// import { createMCQQuestion } from "../../controller/Question/MCQ.controller.js";

// const questionRouter = express.Router();

// questionRouter.post(
//   "/upload_question",
//   UploadImage.fields([
//     { name: "imageQuestion", maxCount: 5 }, // Form-data key: "imageQuestion"
//     { name: "imageAnswer", maxCount: 5 }, // Form-data key: "imageAnswer"
//   ]),
//   isAuthenticated,
//   createLongQuestion
// );
// questionRouter.post(
//   "/upload_mcq_question",
//   UploadImage.fields([{ name: "imageAnswer", maxCount: 5 }]),
//   isAuthenticated,
//   createMCQQuestion
// );

// export default questionRouter;

import express from "express";
import { createLongQuestion } from "../../controller/Question/LongQuestion.controller.js";
import isAuthenticated from "../../middlewares/isAuthenticated.js";
import { UploadImage } from "../../middlewares/multer.js";
import { createMCQQuestion } from "../../controller/Question/MCQ.controller.js";

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

// Route for uploading MCQ questions with optional imageAnswer field
questionRouter.post(
  "/upload_mcq_question",
  UploadImage.fields([{ name: "imageAnswer", maxCount: 1 }]),

  isAuthenticated,
  createMCQQuestion
);

export default questionRouter;
