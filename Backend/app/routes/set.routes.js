const { authJwt, verifySet } = require("../middleware");
const set_controller = require("../controllers/set.controller");
const express = require("express");
const router = express.Router();
const upload = require("../middleware/csvUploader");
module.exports = function(app) {
    app.use(function(req, res, next) {
      res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
      );
      next();
    });
      app.get("/set_name/:setId",
      [authJwt.verifyToken,verifySet.check_access],set_controller.find_set_name);
      app.get("/set/:setId",
      [authJwt.verifyToken,verifySet.check_access],set_controller.findOneSet);
      app.post("/api/add_set/:setId",
      [authJwt.verifyToken, verifySet.check_set, verifySet.if_flashcard_exists],set_controller.add_to_exsist_set)
      app.get("/api/sets",
      [authJwt.verifyToken],set_controller.all_sets)
      app.post("/api/add_set",
      [authJwt.verifyToken, verifySet.check_create_set],set_controller.create_set)

      app.delete("/api/deleteCard/:id",
      [authJwt.verifyToken, verifySet.check_flashcard],set_controller.deletecards)

      app.delete("/api/deleteset/:id",
      [authJwt.verifyToken, verifySet.check_delete_set],set_controller.deleteset)

      app.post("/api/csv/upload",
      [authJwt.verifyToken], upload.single("file"),set_controller.uploadCsv)
      app.post("/csv/upload/:id",
      [authJwt.verifyToken, verifySet.check_access], upload.single("file"),set_controller.uploadCsvToDatabase)
      app.put("/api/editFlashcard/:id",
      [authJwt.verifyToken,verifySet.check_flashcard, verifySet.check_sides],set_controller.editFlashcard)
      

      app.get("/api/csv/download/:id",
      [authJwt.verifyToken, verifySet.check_access], set_controller.downloadCsv);
      app.get("/api/get_points",
        [authJwt.verifyToken], set_controller.getPoints)
        app.get("/api/filter",
      [authJwt.verifyToken], set_controller.filter)
}