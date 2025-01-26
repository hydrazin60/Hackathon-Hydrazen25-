// import nodemailer from "nodemailer";
// export const sendVerificationEmail = async (email, verificationToken) => {
//   const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: process.env.EMAIL,
//       pass: process.env.PASSWORD,
//     },
//   });
//   const maileOptions = {
//     from: process.env.EMAIL,
//     to: email,
//     subject: "Verify your account",
//     text: `Please click on the following link to verify your account: http://localhost:4000/api/v1/hackathon_hydrazen25/auth/verify/${verificationToken}`,
//   };
//   try {
//     await transporter.sendMail(maileOptions);
//     console.log("Email sent successfully");
//   } catch (error) {
//     console.log(
//       `Something went wrong  on Regstering the user ${error.message}`
//     );
//     return res
//       .status(500)
//       .json({
//         success: false,
//         error: true,
//         message: `Something went wrong . please try again `,
//       });
//   }
// };

import nodemailer from "nodemailer";

export const sendVerificationEmail = async (email, verificationToken) => {
  const transporter = nodemailer.createTransport({
    service: "gmail", // or another service like "SendGrid" if you prefer
    auth: {
      user: process.env.EMAIL, // Email address to send from
      pass: process.env.PASSWORD, // App password or email password
    },
  });

  const mailOptions = {
    from: process.env.EMAIL, // The sender's email
    to: email, // Recipient's email
    subject: "Verify your account", // Email subject
    text: `Please click on the following link to verify your account: http://localhost:4000/api/v1/hackathon_hydrazen25/auth/verify/${verificationToken}`, // The verification link
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Verification email sent successfully.");
  } catch (error) {
    console.error(`Error sending verification email: ${error.message}`);
    // You may want to handle this error where the function is called (in the controller or middleware)
  }
};
