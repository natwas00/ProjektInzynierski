const authJwt = require("./authJwt");
const verifySignUp = require("./verifySignUp");
const verifySet = require("./verifySet");
const imageUploader = require("./imageUploader")
const csvUploader = require("./csvUploader")
const verifyOwner = require('./study_access')
const checkSuperStudySet = require("./superstudySet")
const checkClassOwner = require('./verifyTeacher')
const verifyNor = require('./verifyNor')
const verifyAccess = require('./verifyAccess')
module.exports = {
  authJwt,
  verifySignUp,
  verifySet,
  imageUploader,
  csvUploader,
  verifyOwner,
  checkClassOwner,
  checkSuperStudySet,
    verifyNor,
    verifyAccess

};