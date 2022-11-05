const studyController = require('../controllers/superstudySets.controller')
const { authJwt, checkSuperStudySet} = require("../middleware");


const express = require("express");
const router = express.Router();
module.exports = function(app) {
    app.use(function(req, res, next) {
      res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
      );
      next();
    });
    app.get("/api/buySuperStudySet/:setId",[authJwt.verifyToken, checkSuperStudySet.check_owner], studyController.buySuperStudySet);
    app.get("/api/getSuperStudySets",[authJwt.verifyToken],studyController.list_superstudy_sets)


}