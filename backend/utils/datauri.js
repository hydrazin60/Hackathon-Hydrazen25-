// import DataURIParser from "datauri/parser.js";
// import path from "path";

// const parser = new DataURIParser();

// export const getDataUri = (file) => {
//   // Log the file object to understand the structure better
//   console.log("File object received:", file);

//   // Check for basic file properties
//   if (!file || !file.originalname || !file.buffer) {
//     console.error("Invalid file input:", file); // Log any missing properties
//     throw new Error("Invalid file input for DataURI conversion.");
//   }

//   // Extract the file extension and return the Data URI
//   const extName = path.extname(file.originalname).toString();
//   console.log("File extension:", extName); // Log the file extension
//   return parser.format(extName, file.buffer);
// };

import DataURIParser from "datauri/parser.js";
import path from "path";

const parser = new DataURIParser();

export const getDataUri = (file) => {
  // Log the file object to understand the structure better
//   console.log("File object received:", file);

  // Check for basic file properties
  if (!file || !file.originalname || !file.buffer) {
    console.error("Invalid file input:", file); // Log any missing properties
    throw new Error("Invalid file input for DataURI conversion.");
  }

  // Ensure that the buffer is a valid type
  if (!Buffer.isBuffer(file.buffer)) {
    throw new Error("File buffer is not valid.");
  }

  // Extract the file extension and return the Data URI
  const extName = path.extname(file.originalname).toString();
//   console.log("File extension:", extName); // Log the file extension
  return parser.format(extName, file.buffer);
};

// import DataURIParser from "datauri/parser.js";
// import path from "path";

// const parser = new DataURIParser();

// export const getDataUri = (file) => {
//   if (!file || !file.originalname || !file.buffer) {
//     throw new Error("Invalid file input for DataURI conversion.");
//   }
//   const extName = path.extname(file.originalname).toString();
//   return parser.format(extName, file.buffer);
// };
