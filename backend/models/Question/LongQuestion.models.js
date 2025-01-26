import mongoose from "mongoose";
const LongQuestionSchema = new mongoose.Schema(
  {
    QuestionFild: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      default: null,
    },
    imageQuestion: {
      type: [String],
      default: null,
    },
    question: {
      type: String,
      required: true,
    },
    codeQuestion: {
      type: String,
      default: null,
    },
    ParagraphAnswer: {
      type: String,
      default: null,
    },
    imageAnswer: {
      type: String,
      default: null,
    },
    CodeAnswer: {
      type: String,
      default: null,
    },
    isread: {
      type: Boolean,
      default: false,
    },
    feadback: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const LongQuestionModel = mongoose.model("LongQuestin", LongQuestionSchema);
export default LongQuestionModel;
