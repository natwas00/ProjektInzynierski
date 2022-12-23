const url = require("url");
const path = require("path");
const multer = require("multer");
const pathFile = path.join(`${__dirname}/../resources/static/assets/uploads/`)
const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
      cb("Please upload only images.", false);
  }
};
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, pathFile);
  },
  filename: (req, file, cb) => {
    cb(null, `${file.originalname}`);
  },
});
var uploadFile = multer({ storage: storage, fileFilter: imageFilter });
module.exports = uploadFile;