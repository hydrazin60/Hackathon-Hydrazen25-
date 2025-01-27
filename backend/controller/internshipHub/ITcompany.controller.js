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
    const companies = await ITcompanyModel.find();
    return res.status(200).json({
      success: true,
      message: "Companies fetched successfully.",
      data: companies,
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
    const company = await ITcompanyModel.findById(req.params.id);
    return res.status(200).json({
      success: true,
      message: "Company fetched successfully.",
      data: company,
    });
  } catch (error) {
    console.error("Error in getOneCompany:", error.message);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred.",
    });
  }
};
