const express = require("express");
const router = express.Router();
const homeController = require("../controllers/image.upload");
const uploadController = require("../controllers/upload.controller");
const upload = require("../middleware/imageUploader");

module.exports = function (app) {
    //to accsess image uploader
    router.get("/imageUpload", homeController.getHome); //temp! only for visualization
    router.post("/upload", upload.single("file"), uploadController.uploadFiles);
    return app.use("/", router);
};