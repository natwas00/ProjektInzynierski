const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;
var passwordValidator = require('password-validator');
var schema = new passwordValidator();
schema
.is().min(6)                                    // Minimum length 8
.is().max(40)                                  // Maximum length 100
.has().uppercase()                              // Must have uppercase letters
.has().lowercase()                              // Must have lowercase letters
.has().digits(2)                                // Must have at least 2 digits
.has().not().spaces()                           // Should not have spaces


checkDuplicateUsernameOrEmail = (req, res, next) => {
  // Username
  User.findOne({
    where: {
      login: req.body.login
    }
  }).then(user => {
    if (user) {
      res.status(400).send({
        message: "Użytkownik o podanym loginie już istnieje"
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
          message: "Użytkownik o podanym adesie e-mail już istnieje"
        });
        return;
      }

      next();
    });
  });
};
checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
      if (!ROLES.includes(req.body.roles)) {
        res.status(400).send({
          message: "Nie można mieć takiej roli " + req.body.roles
        });
        return;
      }
    
  }
  // Save User to Database
  if (schema.validate(req.body.password)==false){
    var data = schema.validate(req.body.password, { details: true });
    var mess= ""
    mess += "Hasło musi mieć: "
    for (let i = 0; i < data.length; i++) {
      if (data[i].validation == "min"){
        mess += "minimum 6 znaków"
      }
      else if (data[i].validation == "digits"){
        mess+="minimum 2 cyfry"
      }
      else if (data[i].validation == "uppercase"){
        mess+="minimum jedną dużą literę"
      }
      else if (data[i].validation == "max"){
        mess+="długą mniejszą niż 40"
      }
      else if (data[i].validation == "lowercase"){
        mess+="minimum 1 małą literę"
      }
      else if (data[i].validation == "spaces"){
        mess+="brak spacji"
      }
      if (i <data.length -1){
        mess+=", "
      }
      else
        mess+="."
    }

    res.status(400).send({
          message: mess
         });
         return;
  }
  
  next();
};
checkIfNotNull = (req, res, next) =>  {
  if (req.body.login == null || req.body.password == null || req.body.email == null || req.body.first_name == null || req.body.last_name == null){
    res.status(400).send({
      message: "Brakuje danych"
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