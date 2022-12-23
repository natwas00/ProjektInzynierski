const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;
var bcrypt = require("bcryptjs");
var passwordValidator = require('password-validator');
var schema = new passwordValidator();
schema
.is().min(6)                                    // Minimum length 8
.is().max(40)                                  // Maximum length 100
.has().uppercase()                              // Must have uppercase letters
.has().lowercase()                              // Must have lowercase letters
.has().digits(2)                                // Must have at least 2 digits
.has().not().spaces()                           // Should not have spaces
.is().not().oneOf(['Passw0rd', 'Password123', '123456','123456789']);

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
    });
    
    next();
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
      
        next();
      
    
  }
};
check_update_password = (req, res, next) => {
  User.findOne({ where: { id: req.userId } })
    .then(data => {

      if (req.body.new_password1 != null && req.body.new_password2 != null && req.body.old_password != null) {

        var passwordIsValid = bcrypt.compareSync(
          req.body.old_password,
          data.password
        );
        if (passwordIsValid) {
          if (req.body.new_password1 == req.body.new_password2) {
            if (schema.validate(req.body.new_password1) == false) {
              var mess = ""
              var data = schema.validate(req.body.new_password1, { details: true });
              mess += "Hasło musi mieć: "
              for (let i = 0; i < data.length; i++) {
                if (data[i].validation == "min") {
                  mess += "minimum 6 znaków"
                }
                else if (data[i].validation == "digits") {
                  mess += "minimum 2 cyfry"
                }
                else if (data[i].validation == "uppercase") {
                  mess += "minimum jedną dużą literę"
                }
                else if (data[i].validation == "max") {
                  mess += "długą mniejszą niż 40"
                }
                else if (data[i].validation == "lowercase") {
                  mess += "minimum 1 małą literę"
                }
                else if (data[i].validation == "spaces") {
                  mess += "brak spacji"
                }
                if (i < data.length - 1) {
                  mess += ", "
                }
                else
                  mess += "."
              }
              return res.status(400).send({
                message: mess
              });
              
            }
            else {
              next()
            }
          }
          else {
            return res.status(400).send({message: "Podane hasła nie zgadzają się"})
      }
        }
        else {
          return res.status(400).send({message: "Nieprawidłowe hasło"})
      }
      }
      else {
        return res.status(400).send({message: "Brakuje danych"})
      }
    })
}
check_password = (req,res,next) => {
  if (schema.validate(req.body.password)==false){
    var data = schema.validate(req.body.password, { details: true });
    var mess= ""
    mess += "Hasło musi mieć: "
    for (let i = 0; i < data.length; i++) {
      if (data[i].validation == "min") {
        mess += "minimum 6 znaków"
      }
      else if (data[i].validation == "digits") {
        mess += "minimum 2 cyfry"
      }
      else if (data[i].validation == "uppercase") {
        mess += "minimum jedną dużą literę"
      }
      else if (data[i].validation == "max") {
        mess += "długą mniejszą niż 40"
      }
      else if (data[i].validation == "lowercase") {
        mess += "minimum 1 małą literę"
      }
      else if (data[i].validation == "spaces") {
        mess += "brak spacji"
      }
      else if (data[i].validation == "oneOf") {
        mess+="większą złożoność, jest zbyt proste"
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
  else{
  next();
  }
};
checkIfNotNull = (req, res, next) =>  {
  if (req.body.login == null || req.body.password == null || req.body.email == null
    || req.body.first_name == null || req.body.last_name == null || req.body.roles == null) {
    return res.status(400).send({message: "Brakuje danych" });
  }
  else{
  next();
  }
}
checkIfNotNullSignIn = (req, res, next) =>  {
  if (req.body.login == null || req.body.password == null ){
    res.status(400).send({
      message: "Brakuje danych"
    });
    return;
  }
  else{
  next();
  }
}
check_password_valid = (req, res, next) => {
  User.findOne({
    where: {
      login: req.body.login
    }
  })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "Błędny login lub hasło" });
      }
      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );
      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Nieprawidłowe hasło"
        });
      }
      else {
        next()
      }
    })
}
const verifySignUp = {
  checkIfNotNullSignIn: checkIfNotNullSignIn,
  checkDuplicateUsernameOrEmail: checkDuplicateUsernameOrEmail,
  checkRolesExisted: checkRolesExisted,
  checkIfNotNull: checkIfNotNull,
  check_password: check_password,
  check_update_password: check_update_password,
  check_password_valid:check_password_valid
  
};
module.exports = verifySignUp;