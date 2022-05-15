const path = require("path");
const fs = require("fs");
const db = require("../models");
const Image = db.images;
const pathFileUploads = path.join(`${__dirname}/../resources/static/assets/uploads/`)
const pathFileTmp = path.join(`${__dirname}/../resources/static/assets/tmp/`)

const uploadFiles = async (req, res) => {
  try {
    console.log(req.file);
    if (req.file == undefined) {
      return res.send(`You must select a file.`);
    }
    Image.create({
      type: req.file.mimetype,
      id_fishka: 0, // need to take current fishka id that is opened. 0 is placeholder
      name: req.file.originalname,
      data: fs.readFileSync(
        pathFileUploads + req.file.filename
      ),
    }).then((image) => {
      fs.writeFileSync(
        pathFileTmp + image.name,
        image.data
      );
      return res.send(`File has been uploaded.`);
    });
  } catch (error) {
    console.log(error);
    return res.send(`Error when trying upload images: ${error}`);
  }
};
module.exports = {
  uploadFiles,
};