import mongoose from "mongoose";
const ITCompanySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    employees: {
      type: [String],
      default: [],
    },
    departments: {
      type: [String],
      default: [],
    },
    isVacancyOpen: {
      type: Boolean,
      default: false,
    },
    logo: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      default: [],
    },
    website: {
      type: String,
      required: true,
    },
    linkedin: {
      type: String,
      required: true,
    },
    HRlinkedin: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const ITcompanyModel = mongoose.model("ITcompany", ITCompanySchema);
export default ITcompanyModel;
