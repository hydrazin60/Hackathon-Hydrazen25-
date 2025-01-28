// import MCQmodel from "../../models/Question/MCQ.models.js";
// import UserModel from "../../models/user.models.js";
// import cloudinary from "../../utils/cloudinary.js";
// import { getDataUri } from "../../utils/datauri.js";

// export const createMCQQuestion = async (req, res) => {
//   try {
//     const autherId = req.id;
//     const {
//       question,
//       optionA,
//       optionB,
//       optionC,
//       optionD,
//       QuestionFild,
//       subject,
//       correctAnswer,
//       describeAnswer,
//       codeAnswer,
//     } = req.body;

//     console.log(req.body);
//     console.log(req.files);
//     // Validate required fields
//     if (
//       !question ||
//       !optionA ||
//       !optionB ||
//       !optionC ||
//       !optionD ||
//       !QuestionFild ||
//       !correctAnswer
//     ) {
//       return res.status(400).json({
//         success: false,
//         error: true,
//         message: "Please provide all required fields.",
//       });
//     }

//     // Check if the user is authorized
//     if (!autherId) {
//       return res.status(400).json({
//         success: false,
//         error: true,
//         message: "Unauthorized user! Please login first.",
//       });
//     }

//     // Check if the user exists and has the correct role
//     const Auther = await UserModel.findById(autherId);
//     if (!Auther) {
//       return res.status(400).json({
//         success: false,
//         error: true,
//         message: "Unauthorized user! Please login first.",
//       });
//     }
//     if (Auther.role !== "admin") {
//       return res.status(403).json({
//         success: false,
//         error: true,
//         message: "Unauthorized user! Only admin can create questions.",
//       });
//     }

//     const imageAnswer = req.files?.imageAnswer;
//     if (imageAnswer && imageAnswer.length > 1) {
//       return res.status(400).json({
//         success: false,
//         error: true,
//         message: "You can upload only one image for the answer.",
//       });
//     }
//     const fileUri = getDataUri(imageAnswer[0]); // Assuming there's only one image
//     const uploadResponse = await cloudinary.uploader.upload(fileUri.content, {
//       folder: "answers",
//     });

//     // Create new MCQ question document
//     const newMCQQuestion = await MCQmodel.create({
//       question,
//       optionA,
//       optionB,
//       optionC,
//       optionD,
//       QuestionFild,
//       subject,
//       correctAnswer,
//       describeAnswer,
//       codeAnswer,
//       imageAnswer: uploadResponse.secure_url,
//       authorId: autherId,
//     });

//     // Populate the author details for the response
//     const populatedMCQ = await MCQmodel.findById(newMCQQuestion._id).populate(
//       "authorId",
//       "name email role"
//     );

//     // Send successful response
//     res.status(201).json({
//       success: true,
//       error: false,
//       message: "MCQ question created successfully.",
//       data: populatedMCQ,
//     });
//   } catch (err) {
//     console.log(`Error in creating MCQ question: ${err.message}`);
//     res.status(500).json({
//       success: false,
//       error: true,
//       message: "Error in creating MCQ question",
//     });
//   }
// };

import MCQmodel from "../../models/Question/MCQ.models.js";
import UserModel from "../../models/user.models.js";
import cloudinary from "../../utils/cloudinary.js";
import { getDataUri } from "../../utils/datauri.js";

export const createMCQQuestion = async (req, res) => {
  try {
    const autherId = req.id;
    const {
      question,
      optionA,
      optionB,
      optionC,
      optionD,
      QuestionFild,
      subject,
      correctAnswer,
      describeAnswer,
      codeAnswer,
    } = req.body;

    console.log(req.body);
    console.log(req.files);

    // Validate required fields
    if (
      !question ||
      !optionA ||
      !optionB ||
      !optionC ||
      !optionD ||
      !QuestionFild ||
      !correctAnswer
    ) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Please provide all required fields.",
      });
    }

    // Check if the user is authorized
    if (!autherId) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Unauthorized user! Please login first.",
      });
    }

    // Check if the user exists and has the correct role
    const Auther = await UserModel.findById(autherId);
    if (!Auther) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Unauthorized user! Please login first.",
      });
    }
    if (Auther.role !== "admin") {
      return res.status(403).json({
        success: false,
        error: true,
        message: "Unauthorized user! Only admin can create questions.",
      });
    }

    // Optional image handling
    let imageAnswerUrl = null;
    if (req.files?.imageAnswer) {
      const imageAnswer = req.files.imageAnswer;
      if (imageAnswer.length > 1) {
        return res.status(400).json({
          success: false,
          error: true,
          message: "You can upload only one image for the answer.",
        });
      }

      const fileUri = getDataUri(imageAnswer[0]); // Assuming there's only one image
      const uploadResponse = await cloudinary.uploader.upload(fileUri.content, {
        folder: "answers",
      });
      imageAnswerUrl = uploadResponse.secure_url;
    }

    // Create new MCQ question document
    const newMCQQuestion = await MCQmodel.create({
      question,
      optionA,
      optionB,
      optionC,
      optionD,
      QuestionFild,
      subject,
      correctAnswer,
      describeAnswer,
      codeAnswer,
      imageAnswer: imageAnswerUrl, // If no image, it will be null
      authorId: autherId,
    });

    // Populate the author details for the response
    const populatedMCQ = await MCQmodel.findById(newMCQQuestion._id).populate(
      "authorId",
      "name email role"
    );

    // Send successful response
    res.status(201).json({
      success: true,
      error: false,
      message: "MCQ question created successfully.",
      data: populatedMCQ,
    });
  } catch (err) {
    console.log(`Error in creating MCQ question: ${err.message}`);
    res.status(500).json({
      success: false,
      error: true,
      message: "Error in creating MCQ question",
    });
  }
};

/* without image upload */
// import MCQmodel from "../../models/Question/MCQ.models.js";
// import UserModel from "../../models/user.models.js";

// export const createMCQQuestion = async (req, res) => {
//   try {
//     const autherId = req.id;
//     const {
//       question,
//       optionA,
//       optionB,
//       optionC,
//       optionD,
//       QuestionFild,
//       subject,
//       correctAnswer,
//       describeAnswer,
//       codeAnswer,
//     } = req.body;

//     // Validate required fields
//     if (
//       !question ||
//       !optionA ||
//       !optionB ||
//       !optionC ||
//       !optionD ||
//       !QuestionFild ||
//       !correctAnswer
//     ) {
//       return res.status(400).json({
//         success: false,
//         error: true,
//         message: "Please provide all required fields.",
//       });
//     }

//     // Check if the user is authorized
//     if (!autherId) {
//       return res.status(400).json({
//         success: false,
//         error: true,
//         message: "Unauthorized user! Please login first.",
//       });
//     }

//     // Check if the user exists and has the correct role
//     const Auther = await UserModel.findById(autherId);
//     if (!Auther) {
//       return res.status(400).json({
//         success: false,
//         error: true,
//         message: "Unauthorized user! Please login first.",
//       });
//     }
//     if (Auther.role !== "admin") {
//       return res.status(403).json({
//         success: false,
//         error: true,
//         message: "Unauthorized user! Only admin can create questions.",
//       });
//     }

//     // Create new MCQ question document
//     const newMCQQuestion = await MCQmodel.create({
//       question,
//       optionA,
//       optionB,
//       optionC,
//       optionD,
//       QuestionFild,
//       subject,
//       correctAnswer,
//       describeAnswer,
//       codeAnswer,
//       authorId: autherId,
//     });

//     // Populate the author details for the response
//     const populatedMCQ = await MCQmodel.findById(newMCQQuestion._id).populate(
//       "authorId",
//       "name email role"
//     );

//     // Send successful response
//     res.status(201).json({
//       success: true,
//       error: false,
//       message: "MCQ question created successfully.",
//       data: populatedMCQ,
//     });
//   } catch (err) {
//     console.log(`Error in creating MCQ question: ${err.message}`);
//     res.status(500).json({
//       success: false,
//       error: true,
//       message: "Error in creating MCQ question",
//     });
//   }
// };
