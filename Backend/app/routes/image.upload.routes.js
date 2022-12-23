const express = require("express");
const router = express.Router();
const homeController = require("../controllers/image.upload");
const uploadController = require("../controllers/upload.controller");
const upload = require("../middleware/imageUploader");
const { authJwt, verifySet } = require("../middleware");

module.exports = function (app) {
    //to accsess image uploader
   // router.get("/imageUpload", homeController.getHome); //temp! only for visualization
    router.post("/upload/:id", [authJwt.verifyToken, verifySet.check_flashcard],upload.single("file"), uploadController.uploadFiles);
  //  router.get("/files", uploadController.getListFiles);
    router.get("/files/:name", [authJwt.verifyToken],uploadController.download);
    return app.use("/", router);
};