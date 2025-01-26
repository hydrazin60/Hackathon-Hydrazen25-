import mongoose from "mongoose";

const SyllabusSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: [String],
      required: true,
    },
    subject: {
      type: String,
      default: null,
    },
    Department: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const SyllabusModel = mongoose.model("syllabusModel", SyllabusSchema);
export default SyllabusModel;
