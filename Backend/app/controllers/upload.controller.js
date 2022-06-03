const path = require("path");
const fs = require("fs");
const db = require("../models");
const Image = db.images;
const pathFileUploads = path.join(`${__dirname}/../resources/static/assets/uploads/`)
const pathFileTmp = path.join(`${__dirname}/../resources/static/assets/tmp/`)
const fiszki  = db.fiszki;

const uploadFiles = async (req, res) => {
  try {
    console.log(req.file);
    if (req.file == undefined) {
      return res.send(`You must select a file.`);
    }
    Image.create({
      type: req.file.mimetype,
      name: req.file.originalname,
      data: fs.readFileSync(
        pathFileUploads + req.file.filename
      ),
    }).then((image) => {
      fs.writeFileSync(
        pathFileTmp + image.name,
        image.data
      );
      var dat = {
        "imageId": image.id,
        "link": "http://localhost:8080/files/" + image.name
      }
      fiszki.update( dat,{ where: {id: req.params.id}
      })
      return res.send(`File has been uploaded.`);
    });
  } catch (error) {
    console.log(error);
    return res.send(`Error when trying upload images: ${error}`);
  }
};
const download = (req, res) => {
  const fileName = req.params.name;
  const directoryPath = pathFileUploads;
  
  res.sendFile(directoryPath + fileName, fileName, (err) => {
    if (err) {
      res.status(500).send({
        message: "Could not download the file. " + err,
      });
    }
  });
 
};
const getListFiles = (req, res) => {
  const directoryPath =pathFileUploads;
  fs.readdir(directoryPath, function (err, files) {
    if (err) {
      res.status(500).send({
        message: "Unable to scan files!",
      });
    }
    let fileInfos = [];
    files.forEach((file) => {
      fileInfos.push({
        name: file,
        url: "http://localhost:8080/files/" + file,
      });
    });
    res.status(200).send(fileInfos);
  });
};
module.exports = {
  uploadFiles,
  getListFiles,
  download
};