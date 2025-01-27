import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import UserModel from "../models/user.models.js";
import { sendVerificationEmail } from "../utils/sendVerificationEmail.js";

export const RegisterUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Please enter all details",
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Please provide a valid email",
      });
    }

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: true,
        message: "User already exists! please go to login",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await UserModel.create({
      name,
      email,
      password: hashedPassword,
    });

    user.verificationToken = crypto.randomBytes(20).toString("hex");
    user.verificationTokenExpiration = Date.now() + 3600000;
    if (user.verificationTokenExpiration < Date.now()) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Verification token has expired.",
      });
    }

    await user.save();

    sendVerificationEmail(user.email, user.verificationToken).catch((error) => {
      console.log(`Error sending verification email: ${error.message}`);
      return res.status(500).json({
        success: false,
        error: true,
        message: `Error sending verification email: ${error.message}`,
      });
    });
    // Prepare response data
    const userData = user.toObject();
    delete userData.password;
    delete userData.companyId;

    return res.status(201).json({
      success: true,
      error: false,
      message: `Welcome ${name}, your account has been created successfully!`,
      data: userData,
    });
  } catch (error) {
    console.log(`Something went wrong while registering the user: ${error}`);
    return res.status(500).json({
      success: false,
      error: true,
      message: `Something went wrong while registering the user: ${error.message}`,
    });
  }
};

export const VerifyUser = async (req, res) => {
  try {
    const token = req.params.token;
    const user = await UserModel.findOne({ verificationToken: token });
    // Check if the user is found
    if (!user) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "User not found",
      });
    }
    // Check if the user is already verified
    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "User is already verified.",
      });
    }

    // Check if the token has expired
    if (user.verificationTokenExpiration < Date.now()) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Verification token has expired.",
      });
    }

    // Proceed with the verification process
    user.isVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpiration = null; // Clear the token expiration time
    await user.save();

    const userData = user.toObject();
    delete userData.password; // Remove sensitive information from the response
    delete userData.companyId;

    return res.status(200).json({
      success: true,
      error: false,
      message: `Welcome ${user.name}, your account has been verified successfully!`,
      data: userData,
    });
  } catch (error) {
    console.error(`Error verifying user: ${error.message}`);
    return res.status(500).json({
      success: false,
      error: true,
      message:
        "An error occurred while verifying the user. Please try again later.",
    });
  }
};

export const LoginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Please enter email and password",
      });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "User not found",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: true,
        message: "Invalid password",
      });
    }

    const userData = user.toObject();
    delete userData.password;
    delete userData.companyId;

    const token = await jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    const isSecure = process.env.NODE_ENV === "production"; // Check for production environment
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: isSecure, // Only secure in production
        sameSite: "none",
        maxAge: 3600000,
      })
      .status(200)
      .json({
        success: true,
        error: false,
        message: `Welcome ${user.name}, you are logged in successfully!`,
        data: userData,
      });
  } catch (error) {
    console.log(`Something went wrong while logging in the user: ${error}`);
    return res.status(500).json({
      success: false,
      error: true,
      message: `Something went wrong while logging in the user: ${error.message}`,
    });
  }
};
