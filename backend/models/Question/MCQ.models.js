import mongoose from "mongoose";
const MCQSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },
    optionA: {
      type: String,
      required: true,
    },
    optionB: {
      type: String,
      required: true,
    },
    optionC: {
      type: String,
      required: true,
    },
    optionD: {
      type: String,
      required: true,
    },
    Department: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      default: null,
    },
    correctAnswer: {
      type: String,
      enum: ["optionA", "optionB", "optionC", "optionD"],
      required: true,
    },
    describeAnswer: {
      type: String,
      default: null,
    },
    codeAnswer: {
      type: String,
      default: null,
    },
    imageAnswer: {
      type: String,
      default: null,
    },
    isread: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const MCQmodel = mongoose.model("MCQ", MCQSchema);
export default MCQmodel;
