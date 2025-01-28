import LongQuestionModel from "../../models/Question/LongQuestion.models.js";
import UserModel from "../../models/user.models.js";
import cloudinary from "../../utils/cloudinary.js";
import { getDataUri } from "../../utils/datauri.js";

export const createLongQuestion = async (req, res) => {
  try {
    const {
      QuestionFild,
      subject,
      question,
      codeQuestion,
      ParagraphAnswer,
      CodeAnswer,
      feedback,
    } = req.body;

    const userId = req.id;
    // Validate required fields
    if (!question || !QuestionFild) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Please provide both question and field.",
      });
    }

    // Check if the user exists and is authorized
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "User not found.",
      });
    }

    if (user.role !== "admin") {
      return res.status(403).json({
        success: false,
        error: true,
        message: "You are not authorized to create a long question.",
      });
    }

    // Debug uploaded files
    console.log("Uploaded files:", req.files);

    // Process image uploads
    const imageQuestions = req.files?.imageQuestion || [];
    const imageAnswers = req.files?.imageAnswer || [];

    const uploadedQuestionImages = [];
    const uploadedAnswerImages = [];

    // Upload question images to Cloudinary
    for (const file of imageQuestions) {
      const fileUri = getDataUri(file);
      const uploadResponse = await cloudinary.uploader.upload(fileUri.content, {
        folder: "question_images",
      });
      uploadedQuestionImages.push(uploadResponse.secure_url);
    }

    // Upload answer images to Cloudinary
    for (const file of imageAnswers) {
      const fileUri = getDataUri(file);
      const uploadResponse = await cloudinary.uploader.upload(fileUri.content, {
        folder: "answer_images",
      });
      uploadedAnswerImages.push(uploadResponse.secure_url);
    }

    // Create a new LongQuestion document
    const LongQuestion = await LongQuestionModel.create({
      QuestionFild,
      subject,
      question,
      codeQuestion,
      ParagraphAnswer,
      CodeAnswer,
      feedback,
      imageQuestion: uploadedQuestionImages,
      imageAnswer: uploadedAnswerImages,
      authorId: userId,
    });

    // Populate the LongQuestion with author details
    const PopulatedLongQuestion = await LongQuestionModel.findById(
      LongQuestion._id
    ).populate("authorId", "name email role");

    // Return success response with populated data
    return res.status(201).json({
      success: true,
      message: "Long question created successfully.",
      data: PopulatedLongQuestion,
    });
  } catch (error) {
    console.error(`Error in createLongQuestion: ${error.message}`);
    return res.status(500).json({
      success: false,
      error: true,
      message: `Error creating long question: ${error.message}`,
    });
  }
};

export const getAllLongQuestion = async (req, res) => {
  try {
    const LongQuestions = await LongQuestionModel.find().populate(
      "authorId",
      "name email role"
    );
    return res.status(200).json({
      success: true,
      message: "Long questions fetched successfully.",
      data: LongQuestions,
    });
  } catch (error) {
    console.log(`Error in getting all Long question: ${error.message}`);
    return res.status(500).json({
      success: false,
      error: true,
      message: `Error in getting all Long question: ${error.message}`,
    });
  }
};

// export const updateLongQuestion = async (req, res) => {
//   try {
//     const AutherId = req.id;
//     const LongQuestionId = req.params.id;
//     const {
//       QuestionFild,
//       subject,
//       question,
//       codeQuestion,
//       ParagraphAnswer,
//       CodeAnswer,
//       feedback,
//     } = req.body;

//     if (!AutherId || !LongQuestionId) {
//       return res.status(400).json({
//         success: false,
//         error: true,
//         message: "Please provide both question and field.",
//       });
//     }
//     const Auther = await UserModel.findById(AutherId);
//     const LongQuestion = await LongQuestionModel.findById(LongQuestionId);

//     if (Auther.role !== "admin") {
//       return res.status(403).json({
//         success: false,
//         error: true,
//         message: "You are not authorized to update this long question.",
//       });
//     }
//     if (!Auther) {
//       return res.status(404).json({
//         success: false,
//         error: true,
//         message: "User not found.",
//       });
//     }
//     if (!LongQuestion) {
//       return res.status(404).json({
//         success: false,
//         error: true,
//         message: "Long question not found.",
//       });
//     }

//     if (Auther.role !== "admin") {
//       return res.status(403).json({
//         success: false,
//         error: true,
//         message: "You are not authorized to update this long question.",
//       });
//     }
//     const imageQuestions = req.files?.imageQuestion || [];
//     const imageAnswers = req.files?.imageAnswer || [];
//     const uploadedQuestionImages = [];
//     const uploadedAnswerImages = [];

//     console.log("Uploaded files:", imageQuestions);
//     console.log("Image questions:", imageAnswers);

//     for (const file of imageQuestions) {
//       const fileUri = getDataUri(file);
//       const uploadResponse = await cloudinary.uploader.upload(fileUri.content, {
//         folder: "question_images",
//       });
//       uploadedQuestionImages.push(uploadResponse.secure_url);
//     }
//     for (const file of imageAnswers) {
//       const fileUri = getDataUri(file);
//       const uploadResponse = await cloudinary.uploader.upload(fileUri.content, {
//         folder: "answer_images",
//       });
//       uploadedAnswerImages.push(uploadResponse.secure_url);
//     }
//     LongQuestion.QuestionFild = QuestionFild;
//     LongQuestion.subject = subject;
//     LongQuestion.question = question;
//     LongQuestion.codeQuestion = codeQuestion;
//     LongQuestion.ParagraphAnswer = ParagraphAnswer;
//     LongQuestion.CodeAnswer = CodeAnswer;
//     LongQuestion.feedback = feedback;
//     LongQuestion.imageQuestion = uploadedQuestionImages;
//     LongQuestion.imageAnswer = uploadedAnswerImages;
//     await LongQuestion.save();
//     return res.status(200).json({
//       success: true,
//       message: "Long question updated successfully.",
//       data: LongQuestion,
//     });
//   } catch (error) {
//     console.log(`Error in getting all Long question: ${error.message}`);
//     return res.status(500).json({
//       success: false,
//       error: true,
//       message: `Error in getting all Long question: ${error.message}`,
//     });
//   }
// };

export const updateLongQuestion = async (req, res) => {
  try {
    const AutherId = req.id; // Assuming req.id is the logged-in user's ID (Authenticated user)
    const LongQuestionId = req.params.id;
    const {
      QuestionFild,
      subject,
      question,
      codeQuestion,
      ParagraphAnswer,
      CodeAnswer,
      feedback,
    } = req.body;

    // Check if both AuthorId and LongQuestionId are provided
    if (!AutherId || !LongQuestionId) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Please provide both question and field.",
      });
    }

    // Check if the author (user) exists and is an admin
    const Auther = await UserModel.findById(AutherId);
    if (!Auther) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "User not found.",
      });
    }
    if (Auther.role !== "admin") {
      return res.status(403).json({
        success: false,
        error: true,
        message: "You are not authorized to update this long question.",
      });
    }

    // Check if the long question exists
    const LongQuestion = await LongQuestionModel.findById(LongQuestionId);
    if (!LongQuestion) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "Long question not found.",
      });
    }

    // Assign the authorId from the authenticated user to the LongQuestion
    LongQuestion.authorId = AutherId;

    // Handle image uploads if provided
    const imageQuestions = req.files?.imageQuestion || [];
    const imageAnswers = req.files?.imageAnswer || [];
    const uploadedQuestionImages = [];
    const uploadedAnswerImages = [];

    // Upload image questions to cloud storage (Cloudinary)
    for (const file of imageQuestions) {
      const fileUri = getDataUri(file);
      const uploadResponse = await cloudinary.uploader.upload(fileUri.content, {
        folder: "question_images",
      });
      uploadedQuestionImages.push(uploadResponse.secure_url);
    }

    // Upload image answers to cloud storage (Cloudinary)
    for (const file of imageAnswers) {
      const fileUri = getDataUri(file);
      const uploadResponse = await cloudinary.uploader.upload(fileUri.content, {
        folder: "answer_images",
      });
      uploadedAnswerImages.push(uploadResponse.secure_url);
    }

    // Update the LongQuestion document with the new values
    LongQuestion.QuestionFild = QuestionFild || LongQuestion.QuestionFild;
    LongQuestion.subject = subject || LongQuestion.subject;
    LongQuestion.question = question || LongQuestion.question;
    LongQuestion.codeQuestion = codeQuestion || LongQuestion.codeQuestion;
    LongQuestion.ParagraphAnswer =
      ParagraphAnswer || LongQuestion.ParagraphAnswer;
    LongQuestion.CodeAnswer = CodeAnswer || LongQuestion.CodeAnswer;
    LongQuestion.feedback = feedback || LongQuestion.feedback;
    LongQuestion.imageQuestion =
      uploadedQuestionImages.length > 0
        ? uploadedQuestionImages
        : LongQuestion.imageQuestion;
    LongQuestion.imageAnswer =
      uploadedAnswerImages.length > 0
        ? uploadedAnswerImages
        : LongQuestion.imageAnswer;

    // Save the updated LongQuestion document
    await LongQuestion.save();

    return res.status(200).json({
      success: true,
      message: "Long question updated successfully.",
      data: LongQuestion,
    });
  } catch (error) {
    console.log(`Error in updating Long question: ${error.message}`);
    return res.status(500).json({
      success: false,
      error: true,
      message: `Error in updating Long question: ${error.message}`,
    });
  }
};

export const deleteLongQuestion = async (req, res) => {
  try {
    const AutherId = req.id; // Assuming req.id is the logged-in user's ID (Authenticated user)
    const LongQuestionId = req.params.id;
    if (!AutherId || !LongQuestionId) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Please provide both question and field.",
      });
    }
    const Auther = await UserModel.findById(AutherId);
    const LongQuestion = await LongQuestionModel.findById(LongQuestionId);
    if (!Auther) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "User not found.",
      });
    }
    if (!LongQuestion) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "Long question not found.",
      });
    }
    if (Auther.role !== "admin") {
      return res.status(403).json({
        success: false,
        error: true,
        message: "You are not authorized to delete this long question.",
      });
    }

    await LongQuestion.deleteOne();
    return res.status(200).json({
      success: true,
      message: "Long question deleted successfully.",
    });
  } catch (error) {
    console.log(`Error in deleting Long question: ${error.message}`);
    return res.status(500).json({
      success: false,
      error: true,
      message: `Error in deleting Long question: ${error.message}`,
    });
  }
};
