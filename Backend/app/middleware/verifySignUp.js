const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;
var passwordValidator = require('password-validator');
var schema = new passwordValidator();
schema
.is().min(8)                                    // Minimum length 8
.is().max(40)                                  // Maximum length 100
.has().uppercase()                              // Must have uppercase letters
.has().lowercase()                              // Must have lowercase letters
.has().digits(2)                                // Must have at least 2 digits
.has().not().spaces()                           // Should not have spaces
.is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values

checkDuplicateUsernameOrEmail = (req, res, next) => {
  // Username
  User.findOne({
    where: {
      login: req.body.login
    }
  }).then(user => {
    if (user) {
      res.status(400).send({
        message: "Failed! Login is already in use!"
      });
      return;
    }
    // Email
    User.findOne({
      where: {
        email: req.body.email
      }
    }).then(user => {
      if (user) {
        res.status(400).send({
          message: "Failed! Email is already in use!"
        });
        return;
      }

      next();
    });
  });
};
checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        res.status(400).send({
          message: "Failed! Role does not exist = " + req.body.roles[i]
        });
        return;
      }
    }
  }
  // Save User to Database
  if (schema.validate(req.body.password)==false){
    res.status(400).send({
          message: schema.validate(req.body.password, { details: true })
         });
         return;
  }
  
  next();
};
checkIfNotNull = (req, res, next) =>  {
  if (req.body.login == null || req.body.password == null || req.body.email == null || req.body.first_name == null || req.body.last_name == null){
    res.status(400).send({
      message: "Empty data"
    });
    return;
  }
  next();
}
const verifySignUp = {
  checkDuplicateUsernameOrEmail: checkDuplicateUsernameOrEmail,
  checkRolesExisted: checkRolesExisted,
  checkIfNotNull: checkIfNotNull
};
module.exports = verifySignUp;