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
    QuestionFild: {
      type: String,
      required: true,
      enum: [
        "Frontend",
        "Backend",
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
      enum: [
        "React",
        "Flutter",
        "React Native",
        "kotlin",
        "Angular",
        "Vue",
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
      type:  String,
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
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isRead: {
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
