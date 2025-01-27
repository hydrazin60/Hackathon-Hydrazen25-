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
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ITcompanyModel",
      required: true,
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
