import mongoose from "mongoose";
const recruiterSchema = new mongoose.Schema(
  {
    autherID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    companyName: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 100,
    },
    position: {
      type: String,
      default: "HR",
    },
  },
  {
    timestamps: true,
  }
);

const RecruiterModel = mongoose.model("Recruiter", recruiterSchema);
export default RecruiterModel;
