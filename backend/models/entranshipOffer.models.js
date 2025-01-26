import mongoose from "mongoose";
const entranshipOfferSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      default: 0,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    closedDate: {
      type: Date,
    },
    requiredSkills: {
      type: [String],
      default: [],
    },
    companyLocation: {
      type: String,
      required: true,
    },
    companyName: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ITcompanyModel",
    },
  },
  {
    timestamps: true,
  }
);

const entranshipOfferModel = mongoose.model(
  "entranshipOffer",
  entranshipOfferSchema
);
export default entranshipOfferModel;
