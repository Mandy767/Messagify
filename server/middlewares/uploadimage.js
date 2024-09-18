const fs = require("fs");
const multer = require("multer");
const { v4 } = require("uuid");

const MAX_FILE_SIZE_IMAGE = 10;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    const fileExtension = file.mimetype.split("/")[1];
    const uid = v4();
    const fileName = `${uid}.${fileExtension}`;
    cb(null, fileName);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.includes("image")) {
    cb(null, true);
  } else {
    cb(new Error("File type not supported"), false);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE_IMAGE * 1024 * 1024,
  },
  fileFilter,
});

const normalizeFilePath = (req, res, next) => {
  if (!req.file) return next();
  req.file.path = req.file.path.replace(/\\/g, "/");
  next();
};

const folderCheck = () => {
  if (!fs.existsSync("public/images")) {
    fs.mkdirSync("public/images", { recursive: true });
  }
};

folderCheck();

module.exports = {
  imageUpload: () => {
    return [upload.single("profilepic"), normalizeFilePath];
  },
};
