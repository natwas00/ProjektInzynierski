const studyController = require('../controllers/study.controller')
const { authJwt, verifySet, verifyOwner } = require("../middleware");

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
    app.get("/api/multiple-choice/:setId",[authJwt.verifyToken, verifySet.check_access], studyController.multipleChoiceTest);
    app.post('/api/multiple-choice/answers/:setId',[authJwt.verifyToken,verifySet.check_access],studyController.check_answers);
    app.get('/api/trueFalseTest/:setId',[authJwt.verifyToken, verifySet.check_access], studyController.TrueFalse);
    app.get('/api/mixStudy/:setId',[authJwt.verifyToken, verifySet.check_access],studyController.mixStudy);
}