import multer from "multer";
import cloudinary from "../config/cloudinary.js";

const storage = {
  _handleFile(req, file, cb) {
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: "video", folder: "meetyoulive" },
      (error, result) => {
        if (error) return cb(error);
        cb(null, { path: result.secure_url, filename: result.public_id });
      }
    );
    file.stream.pipe(uploadStream);
  },
  _removeFile(_req, file, cb) {
    cloudinary.uploader.destroy(file.filename, { resource_type: "video" }, cb);
  }
};

export const upload = multer({ storage });
