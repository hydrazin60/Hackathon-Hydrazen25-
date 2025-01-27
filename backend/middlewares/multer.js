// import multer from "multer";
// const MAX_FILE_SIZES = {
//   image: 5 * 1024 * 1024, // 5 MB
//   video: 200 * 1024 * 1024, // 100 MB
// };

// const ALLOWED_MIME_TYPES = {
//   image: ["image/jpeg", "image/png", "image/jpg"],
//   video: ["video/mp4", "video/webm", "video/ogg"],
// };

// const multerConfig = (type) =>
//   multer({
//     storage: multer.memoryStorage(),
//     limits: {
//       fileSize: MAX_FILE_SIZES[type],
//     },
//     fileFilter: (req, file, cb) => {
//       if (ALLOWED_MIME_TYPES[type].includes(file.mimetype)) {
//         cb(null, true);
//       } else {
//         cb(
//           new Error(
//             `Invalid file type. Only ${ALLOWED_MIME_TYPES[type]
//               .map((t) => t.split("/")[1])
//               .join(", ")} files are allowed.`
//           ),
//           false
//         );
//       }
//     },
//   });

// const UploadImage = multerConfig("image");
// const UploadVideo = multerConfig("video");
// // Optional: Centralized error handler
// const uploadErrorHandler = (err, req, res, next) => {
//   if (err instanceof multer.MulterError) {
//     // Handle Multer-specific errors
//     res.status(400).json({ error: err.message });
//   } else if (err) {
//     // Handle custom fileFilter errors
//     res.status(400).json({ error: err.message });
//   } else {
//     next();
//   }
// };
// export { UploadImage, UploadVideo, uploadErrorHandler };

import multer from "multer";

const MAX_FILE_SIZES = {
  image: 5 * 1024 * 1024, // 5 MB
  video: 200 * 1024 * 1024, // 200 MB
};

const ALLOWED_MIME_TYPES = {
  image: ["image/jpeg", "image/png", "image/jpg"],
  video: ["video/mp4", "video/webm", "video/ogg"],
};

const multerConfig = (type) => {
  if (!ALLOWED_MIME_TYPES[type]) {
    throw new Error("Invalid file type configuration.");
  }
  return multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: MAX_FILE_SIZES[type] },
    fileFilter: (req, file, cb) => {
      if (ALLOWED_MIME_TYPES[type].includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(
          new Error(
            `Invalid file type. Only ${ALLOWED_MIME_TYPES[type]
              .map((t) => t.split("/")[1])
              .join(", ")} files are allowed.`
          ),
          false
        );
      }
    },
  });
};

const UploadImage = multerConfig("image");
const UploadVideo = multerConfig("video");

const uploadErrorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    res.status(400).json({ error: err.message });
  } else if (err) {
    res.status(400).json({ error: err.message });
  } else {
    next();
  }
};

export { UploadImage, UploadVideo, uploadErrorHandler };
