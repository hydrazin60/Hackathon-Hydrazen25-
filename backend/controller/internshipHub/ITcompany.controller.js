import internshipOfferModel from "../../models/InternshipOffer.models.js";
import ITcompanyModel from "../../models/ITcompany.models.js";
import UserModel from "../../models/user.models.js";
import cloudinary from "../../utils/cloudinary.js";
import { getDataUri } from "../../utils/datauri.js";

export const RegisterCompany = async (req, res, next) => {
  const authorId = req.id;
  console.log("Register user ID:", authorId);
  try {
    const {
      name,
      description,
      location,
      departments,
      Companylinkedin,
      HRlinkedin,
      CEOlinkedin,
      website, // Ensure this is a valid URL string
    } = req.body;

    // Ensure departments is an array
    let departmentsArray = Array.isArray(departments)
      ? departments
      : [departments];

    // Validate required fields
    if (
      !name ||
      !description ||
      !location ||
      !Companylinkedin ||
      !CEOlinkedin
    ) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing.",
      });
    }

    // Validate logo file presence
    if (!req.files?.logo) {
      return res.status(400).json({
        success: false,
        message: "Company logo is required.",
      });
    }

    // Check if the author user is valid
    const authorUser = await UserModel.findById(authorId);
    if (!authorUser) {
      return res.status(404).json({
        success: false,
        message: "User not found. Please log in.",
      });
    }
    if (authorUser.companyId) {
      return res.status(400).json({
        success: false,
        message:
          "You have already registered a company. cannot create another.",
      });
    }

    if (!authorUser.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Please verify your account.",
      });
    }

    if (authorUser.role !== "recruiter" && authorUser.role !== "admin") {
      return res.status(400).json({
        success: false,
        message: "Only recruiters can register a company.",
      });
    }

    // Handle logo upload
    const logo = req.files.logo[0]; // Assuming single logo upload
    const fileUriLogo = getDataUri(logo);
    const logoUpload = await cloudinary.uploader.upload(fileUriLogo.content, {
      resource_type: "image",
      folder: "internshipHub",
      public_id: `${departments}_${name}_${Date.now()}`,
    });

    // Handle images upload (if any)
    let imagesUpload = null;
    if (req.files?.images && req.files.images.length > 0) {
      const images = req.files.images;
      const uploadPromises = images.map((image) => {
        const fileUriImage = getDataUri(image);
        return cloudinary.uploader.upload(fileUriImage.content, {
          resource_type: "image",
          folder: "internshipHub",
          public_id: `${departments}_${name}_images_${Date.now()}`,
        });
      });

      // Upload images concurrently
      const uploadedImages = await Promise.all(uploadPromises);
      imagesUpload = uploadedImages.map((upload) => upload.secure_url); // Only save URLs
    }

    // Validate departments
    const allowedDepartments = [
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
    ];

    console.log("Received departments:", departmentsArray);

    if (!departmentsArray.every((dep) => allowedDepartments.includes(dep))) {
      return res.status(400).json({
        success: false,
        message: "Invalid department(s) provided.",
      });
    }

    // Ensure website URL is in the correct format (basic validation)
    if (website && !/^https?:\/\/[^\s$.?#].[^\s]*$/.test(website)) {
      return res.status(400).json({
        success: false,
        message: "Invalid website URL format.",
      });
    }
    // Create company in the database
    const company = await ITcompanyModel.create({
      name,
      description,
      location,
      departments: departmentsArray, // Make sure departments is an array
      Companylinkedin,
      HRlinkedin,
      CEOlinkedin,
      website, // Save the website directly
      logo: logoUpload.secure_url, // Save only the URL of the logo
      images: imagesUpload || [], // Save only the URLs of images
      autherId: authorId,
    });

    // Update user's companyId
    authorUser.companyId = company._id;
    await authorUser.save();

    return res.status(201).json({
      success: true,
      message: "Company registered successfully.",
      data: company,
    });
  } catch (error) {
    console.error("Error in RegisterCompany:", error.message);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred.",
    });
  }
};

export const getAllCompanies = async (req, res) => {
  try {
    // Fetch all companies
    const companies = await ITcompanyModel.find();

    // Iterate through each company and check for internship offers
    for (const company of companies) {
      const internshipOffersCount = await internshipOfferModel.countDocuments({
        companyId: company._id,
      });

      // Update isVacancyOpen dynamically
      const isVacancyOpen = internshipOffersCount > 0;
      if (company.isVacancyOpen !== isVacancyOpen) {
        company.isVacancyOpen = isVacancyOpen;
        await company.save();
      }
    }

    // Fetch updated companies with populated fields (including internship offers)
    const updatedCompanies = await ITcompanyModel.find()
      .populate("autherId", "name email role linkedin")
      .populate(
        "internshipOffers", // Populate internship offers
        "title description price closedDate requiredSkills numberOfVacancies workTime location"
      );

    // Return updated companies
    return res.status(200).json({
      success: true,
      message: "Companies fetched successfully.",
      data: updatedCompanies,
    });
  } catch (error) {
    console.error("Error in getAllCompanies:", error.message);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred.",
    });
  }
};

export const getOneCompany = async (req, res) => {
  try {
    // Fetch the company
    const company = await ITcompanyModel.findById(req.params.id)
      .populate("autherId", "name email Companylinkedin") // Populate autherId field
      .exec();

    // Before populating internship offers, let's log all internship offers for the company
    const internshipOffers = await internshipOfferModel.find({
      companyId: company._id,
    });
    // Assign internshipOffers manually
    company.internshipOffers = internshipOffers;
    // Log the fetched company and internship offers
    // console.log("Company fetched:", company);
    // console.log("Company Internship Offers:", company.internshipOffers);

    // If the company doesn't exist, return a 404
    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found.",
      });
    }

    // Check if the company has any internship offers
    const internshipOffersCount = internshipOffers.length;

    // Dynamically set isVacancyOpen based on the number of internship offers
    company.isVacancyOpen = internshipOffersCount > 0;

    // Save the updated company status
    await company.save();

    // Return the fetched company with the manually assigned internship offers
    return res.status(200).json({
      success: true,
      message: "Company fetched successfully.",
      data: company,
    });
  } catch (error) {
    // Handle any errors and send a response
    console.error("Error in getOneCompany:", error);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred.",
    });
  }
};

export const updateCompany = async (req, res) => {
  try {
    const authorId = req.id; // Get logged-in user's id
    const companyId = req.params.id; // Company id from params
    const {
      name,
      departments,
      location,
      website,
      Companylinkedin,
      HRlinkedin,
    } = req.body;

    // Check if both authorId and companyId are provided
    if (!authorId || !companyId) {
      return res.status(400).json({
        success: false,
        message: "Please login first.",
      });
    }

    // Find the author user
    const authorUser = await UserModel.findById(authorId);

    if (!authorUser) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Check if user is authorized to update the company
    if (
      !authorUser.isVerified ||
      authorUser.companyId.toString() !== companyId
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized user.",
      });
    }

    // Find the company to update
    const company = await ITcompanyModel.findById(companyId);
    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found.",
      });
    }

    // Handle file upload (logo)
    let logoUrl = company.logo; // Keep the old logo URL if no new logo is uploaded
    if (req.files?.logo) {
      const logo = req.files.logo[0]; // Assuming single logo upload (check if array)

      // Validate logo file type
      if (!logo.mimetype.startsWith("image/")) {
        return res.status(400).json({
          success: false,
          message: "Logo must be an image file.",
        });
      }

      // Convert the logo file to a data URI
      const logoFileUri = getDataUri(logo);
      const logoUpload = await cloudinary.uploader.upload(logoFileUri.content, {
        folder: "logos",
        resource_type: "image",
        public_id: `${companyId}_${Date.now()}_logo`, // Public ID should be unique
      });
      logoUrl = logoUpload.secure_url; // Update the logo URL with the new one
    }

    // Handle file upload (images)
    let imageUrls = company.images || []; // Keep the old images if no new ones are uploaded
    if (req.files?.images && req.files.images.length > 0) {
      const images = req.files.images; // Get images from request

      // Validate images file type
      const validImageFiles = images.filter((image) =>
        image.mimetype.startsWith("image/")
      );
      if (validImageFiles.length !== images.length) {
        return res.status(400).json({
          success: false,
          message: "All files must be images.",
        });
      }

      // Upload images concurrently
      const uploadPromises = validImageFiles.map((image) => {
        const imageFileUri = getDataUri(image);
        return cloudinary.uploader.upload(imageFileUri.content, {
          folder: "company_images",
          resource_type: "image",
          public_id: `${companyId}_${Date.now()}_${image.originalname}`, // Public ID should be unique
        });
      });

      // Wait for all images to be uploaded and get their URLs
      const imageUploads = await Promise.all(uploadPromises);
      imageUrls = imageUploads.map((upload) => upload.secure_url); // Extract secure URLs from the upload results
    }

    // Update company fields (only if they are provided in the request body)
    company.name = name || company.name;
    company.departments = departments || company.departments;
    company.location = location || company.location;
    company.website = website || company.website;
    company.Companylinkedin = Companylinkedin || company.Companylinkedin;
    company.HRlinkedin = HRlinkedin || company.HRlinkedin;
    company.logo = logoUrl; // Save the new logo URL
    company.images = imageUrls; // Save the new images URLs

    // Save the updated company

    await company.save();

    return res.status(200).json({
      success: true,
      message: "Company updated successfully.",
      data: company,
    });
  } catch (error) {
    console.error("Error in updateCompany:", error);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred.",
    });
  }
};
/* with populated fields */
// export const updateCompany = async (req, res) => {
//   try {
//     const authorId = req.id; // Get logged-in user's id
//     const companyId = req.params.id; // Company id from params
//     const {
//       name,
//       description,
//       location,
//       website,
//       Companylinkedin,
//       HRlinkedin,
//     } = req.body;

//     // Check if both authorId and companyId are provided
//     if (!authorId || !companyId) {
//       return res.status(400).json({
//         success: false,
//         message: "Please login first.",
//       });
//     }

//     // Find the author user and populate required fields (name, linkedin, role)
//     const authorUser = await UserModel.findById(authorId); // Populate name, linkedin, role fields
//     if (!authorUser) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found.",
//       });
//     }

//     // Check if user is authorized to update the company
//     if (
//       !authorUser.isVerified ||
//       authorUser.companyId.toString() !== companyId
//     ) {
//       return res.status(403).json({
//         success: false,
//         message: "Unauthorized user.",
//       });
//     }

//     // Find the company to update
//     const company = await ITcompanyModel.findById(companyId);
//     if (!company) {
//       return res.status(404).json({
//         success: false,
//         message: "Company not found.",
//       });
//     }

//     // Handle file upload (logo)
//     let logoUrl = company.logo; // Keep the old logo URL if no new logo is uploaded
//     if (req.files?.logo) {
//       const logo = req.files.logo[0]; // Assuming single logo upload (check if array)

//       // Validate logo file type
//       if (!logo.mimetype.startsWith("image/")) {
//         return res.status(400).json({
//           success: false,
//           message: "Logo must be an image file.",
//         });
//       }

//       // Convert the logo file to a data URI
//       const logoFileUri = getDataUri(logo);
//       const logoUpload = await cloudinary.uploader.upload(logoFileUri.content, {
//         folder: "logos",
//         resource_type: "image",
//         public_id: `${companyId}_${Date.now()}_logo`, // Public ID should be unique
//       });
//       logoUrl = logoUpload.secure_url; // Update the logo URL with the new one
//     }

//     // Handle file upload (images)
//     let imageUrls = company.images || []; // Keep the old images if no new ones are uploaded
//     if (req.files?.images && req.files.images.length > 0) {
//       const images = req.files.images; // Get images from request

//       // Validate images file type
//       const validImageFiles = images.filter((image) =>
//         image.mimetype.startsWith("image/")
//       );
//       if (validImageFiles.length !== images.length) {
//         return res.status(400).json({
//           success: false,
//           message: "All files must be images.",
//         });
//       }

//       // Upload images concurrently
//       const uploadPromises = validImageFiles.map((image) => {
//         const imageFileUri = getDataUri(image);
//         return cloudinary.uploader.upload(imageFileUri.content, {
//           folder: "company_images",
//           resource_type: "image",
//           public_id: `${companyId}_${Date.now()}_${image.originalname}`, // Public ID should be unique
//         });
//       });

//       // Wait for all images to be uploaded and get their URLs
//       const imageUploads = await Promise.all(uploadPromises);
//       imageUrls = imageUploads.map((upload) => upload.secure_url); // Extract secure URLs from the upload results
//     }

//     // Update company fields (only if they are provided in the request body)
//     company.name = name || company.name;
//     company.description = description || company.description;
//     company.location = location || company.location;
//     company.website = website || company.website;
//     company.Companylinkedin = Companylinkedin || company.Companylinkedin;
//     company.HRlinkedin = HRlinkedin || company.HRlinkedin;
//     company.logo = logoUrl; // Save the new logo URL
//     company.images = imageUrls; // Save the new images URLs

//     // Save the updated company
//     await company.save();

//     return res.status(200).json({
//       success: true,
//       message: "Company updated successfully.",
//       data: company,
//       author: authorUser, // Include populated author details in the response
//     });
//   } catch (error) {
//     console.error("Error in updateCompany:", error);
//     return res.status(500).json({
//       success: false,
//       message: "An unexpected error occurred.",
//     });
//   }
// };

export const deleteCompany = async (req, res) => {
  try {
    const companyId = req.params.id;
    const authorId = req.id; // Get logged-in user's id

    if (!authorId || !companyId) {
      return res.status(400).json({
        success: false,
        message: "Unauthorized user! Please login first.",
      });
    }

    // Find the company and author user
    const company = await ITcompanyModel.findById(companyId);
    const authorUser = await UserModel.findById(authorId);

    if (!company || !authorUser) {
      return res.status(404).json({
        success: false,
        message: "Company or User not found.",
      });
    }

    // Check if the authorId matches the company author or if the user is an Admin
    if (
      authorId !== company.authorId.toString() && // Ensure the user is the creator of the company
      !(authorUser.role === "Admin" || authorUser.role === "recruiter") // Or an Admin or recruiter
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized user.",
      });
    }

    // Delete the company
    await company.deleteOne();

    // Remove companyId from the User model (if the user created the company)
    if (authorUser.companyId && authorUser.companyId.toString() === companyId) {
      authorUser.companyId = null; // Remove the reference to the company
      await authorUser.save(); // Save the updated user document
    }

    return res.status(200).json({
      success: true,
      message: "Company deleted successfully.",
    });
  } catch (error) {
    console.error("Error in deleteCompany:", error);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred.",
    });
  }
};
