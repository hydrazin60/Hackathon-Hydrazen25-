import MCQmodel from "../../models/Question/MCQ.models.js";
import UserModel from "../../models/user.models.js";
import cloudinary from "../../utils/cloudinary.js";
import { getDataUri } from "../../utils/datauri.js";
import mongoose from "mongoose";

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
    if (!autherId || !mongoose.Types.ObjectId.isValid(autherId)) {
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

export const getAllMCQQuestion = async (req, res) => {
  try {
    const allMCQQuestion = await MCQmodel.find().populate(
      "authorId",
      "name email role"
    );
    return res.status(200).json({
      success: true,
      error: false,
      message: "All MCQ question fetched successfully",
      data: allMCQQuestion,
    });
  } catch (error) {
    console.log(`Error in getting all MCQ question: ${error.message}`);
    return res.status(500).json({
      success: false,
      error: true,
      message: `Error in getting all MCQ question: ${error.message}`,
    });
  }
};

export const DeleteMCQQuestion = async (req, res) => {
  try {
    const MCQquestionId = req.params.id;
    const authorId = req.id; // ID from authenticated user
    // Validate inputs
    if (!authorId || !mongoose.Types.ObjectId.isValid(authorId)) {
      return res.status(400).json({
        success: false,
        error: true,
        message:
          "Unauthorized user! Invalid or missing user ID. Please log in.",
      });
    }

    if (!MCQquestionId || !mongoose.Types.ObjectId.isValid(MCQquestionId)) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Invalid or missing MCQ question ID.",
      });
    }

    // Fetch the MCQ question
    const MCQquestion = await MCQmodel.findById(MCQquestionId);
    if (!MCQquestion) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "MCQ question not found.",
      });
    }

    // Fetch the author user
    const authorUser = await UserModel.findById(authorId);
    if (!authorUser) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "User not found.",
      });
    }

    // Check if the user has admin privileges
    if (authorUser.role !== "admin") {
      return res.status(403).json({
        success: false,
        error: true,
        message: "Unauthorized user! Only admins can delete questions.",
      });
    }

    // Delete the MCQ question
    await MCQmodel.findByIdAndDelete(MCQquestionId);

    return res.status(200).json({
      success: true,
      error: false,
      message: "MCQ question deleted successfully.",
    });
  } catch (error) {
    console.error(`Error in deleting MCQ question: ${error.message}`);
    return res.status(500).json({
      success: false,
      error: true,
      message: "An error occurred while deleting the MCQ question.",
    });
  }
};

export const updateMCQQuestion = async (req, res) => {
  try {
    console.log("Incoming Request:", req.body, req.files);

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
    } = req.body;

    const MCQquestionId = req.params.id;
    const authorId = req.id; // Authenticated user ID

    // Validate IDs
    if (!authorId || !mongoose.Types.ObjectId.isValid(authorId)) {
      return res.status(400).json({
        success: false,
        message:
          "Unauthorized user! Invalid or missing user ID. Please log in.",
      });
    }

    if (!MCQquestionId || !mongoose.Types.ObjectId.isValid(MCQquestionId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid or missing MCQ question ID.",
      });
    }

    // Check if the user exists and is an admin
    const Author = await UserModel.findById(authorId);
    if (!Author) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (Author.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized user! Only admins can update questions.",
      });
    }

    // Check if the MCQ question exists
    const MCQquestion = await MCQmodel.findById(MCQquestionId);
    if (!MCQquestion) {
      return res.status(404).json({
        success: false,
        message: "MCQ question not found.",
      });
    }

    // Handle file upload if an image is provided
    let imageAnswerUrl = MCQquestion.imageAnswer; // Default to existing image
    if (req.files?.imageAnswer && req.files.imageAnswer.length > 0) {
      const imageAnswer = req.files.imageAnswer[0]; // Access the first file in the array

      // Convert the file to Data URI
      const fileURI = getDataUri(imageAnswer);

      // Upload the file to Cloudinary
      const uploadedImage = await cloudinary.uploader.upload(fileURI.content, {
        folder: "imageAnswer",
      });

      imageAnswerUrl = uploadedImage.secure_url; // Update the image URL
    }

    // Update the MCQ question fields
    MCQquestion.question = question || MCQquestion.question;
    MCQquestion.optionA = optionA || MCQquestion.optionA;
    MCQquestion.optionB = optionB || MCQquestion.optionB;
    MCQquestion.optionC = optionC || MCQquestion.optionC;
    MCQquestion.optionD = optionD || MCQquestion.optionD;
    MCQquestion.QuestionFild = QuestionFild || MCQquestion.QuestionFild;
    MCQquestion.subject = subject || MCQquestion.subject;
    MCQquestion.correctAnswer = correctAnswer || MCQquestion.correctAnswer;
    MCQquestion.describeAnswer = describeAnswer || MCQquestion.describeAnswer;
    MCQquestion.imageAnswer = imageAnswerUrl;

    // Save the updated question
    const updatedMCQquestion = await MCQquestion.save();

    return res.status(200).json({
      success: true,
      message: "MCQ question updated successfully.",
      data: updatedMCQquestion,
    });
  } catch (error) {
    console.error(`Error in updating MCQ question: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the MCQ question.",
    });
  }
};
