import intranshipOfferModel from "../../models/InternshipOffer.models.js";
import ITcompanyModel from "../../models/ITcompany.models.js";
import UserModel from "../../models/user.models.js";
import internshipOfferModel from "../../models/InternshipOffer.models.js";
import mongoose from "mongoose";

export const UploadInternshipOffer = async (req, res) => {
  try {
    const authorId = req.id;
    const {
      title,
      description,
      price,
      closedDate,
      requiredSkills,
      numberOfVacancies,
      workTime,
      location,
    } = req.body;

    if (!title || !description || !location) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Please enter title, description, and location.",
      });
    }

    if (!authorId) {
      return res.status(401).json({
        success: false,
        error: true,
        message: "Please login first.",
      });
    }

    const Author = await UserModel.findById(authorId);
    if (!Author || (Author.role !== "recruiter" && Author.role !== "admin")) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "Recruiter not found.",
      });
    }

    const companyId = Author.companyId;
    const company = await ITcompanyModel.findById(companyId);
    if (!company) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "Company not found.",
      });
    }

    // Parse price if required
    let parsedPrice = price;
    if (typeof price === "string") {
      parsedPrice = parseFloat(price.split(" ")[0]); // Extract numeric value
      if (isNaN(parsedPrice)) {
        return res.status(400).json({
          success: false,
          error: true,
          message: "Invalid price format.",
        });
      }
    }

    const internshipOffer = new intranshipOfferModel({
      authorId,
      companyId,
      title,
      description,
      price: parsedPrice, // Save parsed price
      closedDate,
      requiredSkills,
      numberOfVacancies,
      workTime,
      location, // Include location
      recruiterId: authorId, // Ensure recruiterId is stored
    });

    await internshipOffer.save();
    return res.status(200).json({
      success: true,
      error: false,
      message: "Internship offer uploaded successfully.",
      internshipOffer,
    });
  } catch (err) {
    console.error(
      `Something went wrong on uploading internship offer: ${err.message}`
    );
    return res.status(500).json({
      success: false,
      error: true,
      message: `Something went wrong on uploading internship offer: ${err.message}`,
    });
  }
};

export const GateAllInternshipOffer = async (req, res) => {
  try {
    const internshipOffers = await internshipOfferModel
      .find()
      .populate("recruiterId", "name")
      .limit(10); // fetch a maximum of 10 internship offers

    return res.status(200).json({
      success: true,
      error: false,
      message: "Internship offers fetched successfully",
      data: internshipOffers,
    });
  } catch (error) {
    console.log(
      `Something went wrong while fetching Internship Offers: ${error.message}`
    );
    return res.status(500).json({
      success: false,
      error: true,
      message: `Something went wrong while fetching Internship Offers: ${error.message}`,
    });
  }
};

export const GetOneInternshipOffer = async (req, res) => {
  try {
    const internshipOfferPost_Id = req.params.id;
    if (
      !internshipOfferPost_Id ||
      internshipOfferPost_Id.trim() === "" ||
      !mongoose.Types.ObjectId.isValid(internshipOfferPost_Id)
    ) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Internship Post is not found",
      });
    }
    const internshipOffer = await internshipOfferModel
      .findById(internshipOfferPost_Id)
      .populate("recruiterId", "name");
    if (!internshipOffer) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "Internship Offer not found.",
      });
    }
    return res.status(200).json({
      success: true,
      error: false,
      message: "Internship Offer fetched successfully",
      internshipOffer,
    });
  } catch (error) {
    console.log(
      `Something went wrong while fetching Internship Offers: ${error.message}`
    );
    return res.status(500).json({
      success: false,
      error: true,
      message: `Something went wrong while fetching Internship Offers: ${error.message}`,
    });
  }
};

export const DeleteInternshipOffer = async (req, res) => {
  try {
    const internshipOfferId = req.params.id;
    // Validate the ID format
    if (
      !internshipOfferId ||
      internshipOfferId.trim() === "" ||
      !mongoose.Types.ObjectId.isValid(internshipOfferId)
    ) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Invalid internship offer ID.",
      });
    }
    // Check if the internship offer exists
    const internshipOffer = await internshipOfferModel.findById(
      internshipOfferId
    );
    if (!internshipOffer) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "Internship offer not found.",
      });
    }
    // Check if the user is authorized to delete the offer (if applicable)
    if (req.id !== internshipOffer.recruiterId.toString()) {
      return res.status(403).json({
        success: false,
        error: true,
        message: "You are not authorized to delete this internship offer.",
      });
    }
    // Delete the internship offer
    await internshipOfferModel.findByIdAndDelete(internshipOfferId);

    return res.status(200).json({
      success: true,
      error: false,
      message: "Internship offer deleted successfully.",
    });
  } catch (error) {
    console.log(
      `Something went wrong while deleting internship offer: ${error.message}`
    );
    return res.status(500).json({
      success: false,
      error: true,
      message: `Something went wrong while deleting internship offer: ${error.message}`,
    });
  }
};

// export const UpdateInternshipOffer = async (req, res) => {
//   try {
//     const {
//       title,
//       description,
//       price,
//       closedDate,
//       requiredSkills,
//       numberOfVacancies,
//       workTime,
//       location,
//     } = req.body;

//     const internshipOfferPost_Id = req.params.id;
//     const Author_Id = req.id;

//     if (
//       !internshipOfferPost_Id ||
//       internshipOfferPost_Id.trim() === "" ||
//       !mongoose.Types.ObjectId.isValid(internshipOfferPost_Id)
//     ) {
//       return res.status(400).json({
//         success: false,
//         error: true,
//         message: "Internship Post is not found",
//       });
//     }
//     if (
//       !Author_Id ||
//       Author_Id.trim() === "" ||
//       !mongoose.Types.ObjectId.isValid(Author_Id)
//     ) {
//       return res.status(401).json({
//         success: false,
//         error: true,
//         message: "Please login first",
//       });
//     }
//     const internshipOffer = await internshipOfferModel.findById(
//       internshipOfferPost_Id
//     );
//     if (!internshipOffer) {
//       return res.status(404).json({
//         success: false,
//         error: true,
//         message: "Internship offer post not found",
//       });
//     }
//     if (internshipOffer.recruiterId.toString() !== Author_Id) {
//       return res.status(403).json({
//         success: false,
//         error: true,
//         message: "You are not authorized to update this internship offer.",
//       });
//     }
//     let parsedPrice = price;
//     if (typeof price === "string") {
//       parsedPrice = parseFloat(price.split(" ")[0]); // Extract numeric value
//       if (isNaN(parsedPrice)) {
//         return res.status(400).json({
//           success: false,
//           error: true,
//           message: "Invalid price format.",
//         });
//       }
//     }
//     internshipOffer.title = title;
//     internshipOffer.description = description;
//     internshipOffer.price = parsedPrice;
//     internshipOffer.closedDate = closedDate;
//     internshipOffer.requiredSkills = requiredSkills;
//     internshipOffer.numberOfVacancies = numberOfVacancies;
//     internshipOffer.workTime = workTime;
//     internshipOffer.location = location;
//     await internshipOffer.save();
//   } catch (error) {
//     console.log(
//       `Something went wrong while updating internship offer: ${error.message}`
//     );
//     return res.status(500).json({
//       success: false,
//       error: true,
//       message: `Something went wrong while updating internship offer: ${error.message}`,
//     });
//   }
// };

export const UpdateInternshipOffer = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      closedDate,
      requiredSkills,
      numberOfVacancies,
      workTime,
      location,
    } = req.body;

    const internshipOfferPost_Id = req.params.id;
    const Author_Id = req.id;

    // Validate internship offer ID
    if (
      !internshipOfferPost_Id ||
      internshipOfferPost_Id.trim() === "" ||
      !mongoose.Types.ObjectId.isValid(internshipOfferPost_Id)
    ) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Internship post ID is not valid.",
      });
    }

    // Validate author ID (user must be logged in)
    if (
      !Author_Id ||
      Author_Id.trim() === "" ||
      !mongoose.Types.ObjectId.isValid(Author_Id)
    ) {
      return res.status(401).json({
        success: false,
        error: true,
        message: "Please login first.",
      });
    }

    // Find the internship offer by ID
    const internshipOffer = await internshipOfferModel.findById(
      internshipOfferPost_Id
    );

    // Check if internship offer exists
    if (!internshipOffer) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "Internship offer post not found.",
      });
    }

    // Check if the current user is the recruiter of the internship offer
    if (internshipOffer.recruiterId.toString() !== Author_Id) {
      return res.status(403).json({
        success: false,
        error: true,
        message: "You are not authorized to update this internship offer.",
      });
    }

    // Parse the price if it is in a string format
    let parsedPrice = price;
    if (typeof price === "string") {
      parsedPrice = parseFloat(price.split(" ")[0]); // Extract numeric value
      if (isNaN(parsedPrice)) {
        return res.status(400).json({
          success: false,
          error: true,
          message: "Invalid price format.",
        });
      }
    }

    // Update the internship offer with new values
    internshipOffer.title = title;
    internshipOffer.description = description;
    internshipOffer.price = parsedPrice;
    internshipOffer.closedDate = closedDate;
    internshipOffer.requiredSkills = requiredSkills;
    internshipOffer.numberOfVacancies = numberOfVacancies;
    internshipOffer.workTime = workTime;
    internshipOffer.location = location;

    // Save the updated internship offer
    await internshipOffer.save();

    // Return success response
    return res.status(200).json({
      success: true,
      error: false,
      message: "Internship offer updated successfully.",
      data: internshipOffer,
    });
  } catch (error) {
    console.log(
      `Something went wrong while updating internship offer: ${error.message}`
    );
    return res.status(500).json({
      success: false,
      error: true,
      message: `Something went wrong while updating internship offer: ${error.message}`,
    });
  }
};
