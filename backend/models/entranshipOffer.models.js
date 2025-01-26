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
      min: [0, "Price must be non-negative"],
    },
    date: {
      type: Date,
      default: Date.now,
    },
    closedDate: {
      type: Date,
      validate: {
        validator: function (value) {
          return !value || value > this.date;
        },
        message: "Closed date must be after the creation date",
      },
    },

    requiredSkills: {
      type: [String],
      validate: {
        validator: function (skills) {
          return skills.every((skill) => typeof skill === "string");
        },
        message: "Each skill must be a string",
      },
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
