import mongoose from "mongoose";

const internshipOfferSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    price: {
      type: Number,
      default: 0,
      min: [0, "Price must be a non-negative number"],
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
      default: [
        "Team Working",
        "Problem Solving",
        "Critical Thinking",
        "Communication",
      ],
    },
    Internshipcategory: {
      type: String,
      enum: [
        "Full Stack",
        "Frontend",
        "Backend",
        "App Development",
        "DevOps",
        "Full Stack Web",
        "ML/AI Development",
        "UI/UX",
        "Android Development",
        "Ios Development",
        "Web Development",
        "Digital Marketing",
        "Cyber Security",
        "Cloud Computing",
        "Data Analytics",
      ],
      required: [true, "Internship category is required"],
    },
    numberOfVacancies: {
      type: Number,
      default: 1,
      min: [1, "Number of vacancies must be at least 1"],
    },
    workTime: {
      type: String,
      default: "Full Time",
    },
    location: {
      type: String,
      required: [true, "Location is required"],
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ITcompany",
      required: [true, "Company ID is required"],
    },
    recruiterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Recruiter ID is required"],
    },
  },
  {
    timestamps: true,
  }
);

const internshipOfferModel = mongoose.model(
  "internshipOffer",
  internshipOfferSchema
);

export default internshipOfferModel;

// import mongoose from "mongoose";
// const intranshipOfferSchema = new mongoose.Schema(
//   {
//     title: {
//       type: String,
//       required: true,
//     },
//     description: {
//       type: String,
//       required: true,
//     },
//     price: {
//       type: Number,
//       default: 0,
//       min: [0, "Price must be non-negative"],
//     },
//     date: {
//       type: Date,
//       default: Date.now,
//     },
//     closedDate: {
//       type: Date,
//       validate: {
//         validator: function (value) {
//           return !value || value > this.date;
//         },
//         message: "Closed date must be after the creation date",
//       },
//     },
//     requiredSkills: {
//       type: [String],
//       validate: {
//         validator: function (skills) {
//           return skills.every((skill) => typeof skill === "string");
//         },
//         message: "Each skill must be a string",
//       },
//       default: [
//         "Team Working",
//         "Problem Solving",
//         "Critical Thinking",
//         "Communication",
//       ],
//     },
//     numberOfVacancies: {
//       type: Number,
//       default: 1,
//       min: [1, "Number of vacancies must be non-negative"],
//     },
//     workTime: {
//       type: String,
//       default: "Full Time",
//     },
//     location: {
//       type: String,
//       required: true,
//     },
//     companyId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "ITcompanyModel",
//       required: true,
//     },
//     recruiterId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// const intranshipOfferModel = mongoose.model(
//   "intranshipOffer",
//   intranshipOfferSchema
// );
// export default intranshipOfferModel;
