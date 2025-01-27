import express from "express";
import {
  getAllCompanies,
  getOneCompany,
  RegisterCompany,
} from "../../controller/internshipHub/ITcompany.controller.js";
import isAuthenticated from "../../middlewares/isAuthenticated.js";
import { UploadImage } from "../../middlewares/multer.js";
import {
  DeleteInternshipOffer,
  GateAllInternshipOffer,
  GetOneInternshipOffer,
  UpdateInternshipOffer,
  UploadInternshipOffer,
} from "../../controller/internshipHub/InternshipOffer.controller.js";

const internshipHUBrouter = express.Router();
internshipHUBrouter.post(
  "/register",
  UploadImage.fields([
    { name: "logo", maxCount: 1 }, // Only one logo allowed
    { name: "images", maxCount: 6 }, // Allow up to 6 images
  ]),
  isAuthenticated,
  RegisterCompany
);
internshipHUBrouter.get("/get_all_companies", getAllCompanies);
internshipHUBrouter.get("/get_one_company/:id", getOneCompany);
internshipHUBrouter.post(
  "/upload_internship_offer",
  isAuthenticated,
  UploadInternshipOffer
);
internshipHUBrouter.get("/get_all_internship_offers", GateAllInternshipOffer);
internshipHUBrouter.delete(
  "/delete_internship_offer/:id",
  isAuthenticated,
  DeleteInternshipOffer
);
internshipHUBrouter.post(
  "/upload_internship_offer/:id",
  isAuthenticated,
  UpdateInternshipOffer
);
internshipHUBrouter.get("/get_one_internship_offer/:id", GetOneInternshipOffer);
export default internshipHUBrouter;
