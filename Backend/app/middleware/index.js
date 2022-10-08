const authJwt = require("./authJwt");
const verifySignUp = require("./verifySignUp");
const verifySet = require("./verifySet");
const imageUploader = require("./imageUploader")
const csvUploader = require("./csvUploader")
const verifyOwner = require('./study_access')
const checkClassOwner = require('./verifyTeacher')
module.exports = {
  authJwt,
  verifySignUp,
  verifySet,
  imageUploader,
  csvUploader,
  verifyOwner,
  checkClassOwner
};