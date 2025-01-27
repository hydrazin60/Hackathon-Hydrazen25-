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
    ).populate("authorId", "name email role" );

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


