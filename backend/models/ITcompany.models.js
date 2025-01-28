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
    departments: {
      type: [String],
      enum: [
        "Frontend",
        "Backend",
        "MERN Stack",
        "AI/ML",
        "UI/UX",
        "Data Analytics",
        "HR",
        "App Development",
        "Android Development",
        "Ios Development",
        "Web Development",
        "Digital Marketing",
        "Cyber Security",
        "Cloud Computing",
        "Blockchain",
        "DevOps",
        "Machine Learning",
        "Data Science",
        "Artificial Intelligence",
        "Robotics",
        "IOT",
      ],
      // default: ["Frontend", "Backend"],
    },
    isVacancyOpen: {
      type: Boolean,
      default: false,
    },
    logo: {
      type: String,
      required: true,
      // validate: {
      //   validator: function (url) {
      //     return /^(https?:\/\/)?([\w\-]+\.)+[\w\-]+(\/[\w\-]*)*$/.test(url);
      //   },
      //   message: "Invalid URL format",
      // },
    },
    images: {
      type: [String],
      default: [],
      // validate: {
      //   validator: function (urls) {
      //     return urls.every((url) =>
      //       /^(https?:\/\/)?([\w\-]+\.)+[\w\-]+(\/[\w\-]*)*$/.test(url)
      //     );
      //   },
      //   message: "Invalid URL format in images array",
      // },
    },
    website: {
      type: String,
      // validate: {
      //   validator: function (url) {
      //     return /^(https?:\/\/)?([\w\-]+\.)+[\w\-]+(\/[\w\-]*)*$/.test(url);
      //   },
      //   message: "Invalid URL format",
      // },
    },
    Companylinkedin: {
      type: String,
      required: true,
      // validate: {
      //   validator: function (url) {
      //     return /^(https?:\/\/)?([\w\-]+\.)+[\w\-]+(\/[\w\-]*)*$/.test(url);
      //   },
      //   message: "Invalid URL format",
      // },
    },
    HRlinkedin: {
      type: String,
      required: true,
      //validate: {
      //   validator: function (url) {
      //     return /^(https?:\/\/)?([\w\-]+\.)+[\w\-]+(\/[\w\-]*)*$/.test(url);
      //   },
      //   message: "Invalid URL format",
      // },
    },
    CEOlinkedin: {
      type: String,
      required: true,
      // validate: {
      //   validator: function (url) {
      //     return /^(https?:\/\/)?([\w\-]+\.)+[\w\-]+(\/[\w\-]*)*$/.test(url);
      //   },
      //   message: "Invalid URL format",
      // },
    },
    autherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    internshipOffers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "internshipOffer", // Reference to the InternshipOffer model
      },
    ],
    isVacancyOpen: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const ITcompanyModel = mongoose.model("ITcompany", ITCompanySchema);
export default ITcompanyModel;
