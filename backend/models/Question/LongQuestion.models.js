import mongoose from "mongoose";
const LongQuestionSchema = new mongoose.Schema(
  {
    QuestionFild: {
      type: String,
      required: true,
      enum: [
        "Frontend",
        "Backend",
        "Full Stack",
        "App Development",
        "DevOps",
        "Full Stack Web",
        "ML/AI Development",
        "UI/UX",
      ],
      message:
        "Invalid field. Please select a valid field from the predefined list.",
    },
    subject: {
      type: String,
      default: null,
      enum: [
        "React",
        "Angular",
        "Vue",
        "Flutter",
        "React Native",
        "kotlin",
        "Node",
        "JavaScript",
        "HTML",
        "CSS",
        "Python",
        "Java",
        "C#",
        "Figma",
        ".NET",
        "SpringBoot",
        "Django",
        "NumPy",
        "Excel",
        "AWS",
      ],
      message:
        "Invalid subject. Please select a valid subject from the predefined list.",
    },
    imageQuestion: {
      type: [String],
      default: null,
      // validate: {
      //   validator: function (urls) {
      //     return (
      //       !urls ||
      //       urls.every((url) =>
      //         /^(https?:\/\/)?([\w\-]+\.)+[\w\-]+(\/[\w\-]*)*$/.test(url)
      //       )
      //     );
      //   },
      //   message: "Invalid URL format in imageQuestion",
      // },
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
      type: [String],
      default: null,
      // validate: {
      //   validator: function (url) {
      //     return (
      //       !url || /^(https?:\/\/)?([\w\-]+\.)+[\w\-]+(\/[\w\-]*)*$/.test(url)
      //     );
      //   },
      //   message: "Invalid URL format in imageAnswer",
      // },
    },
    CodeAnswer: {
      type: String,
      default: null,
    },
    isread: {
      type: Boolean,
      default: false,
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    feedback: {
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
