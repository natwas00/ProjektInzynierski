const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
var passwordValidator = require('password-validator');
var schema = new passwordValidator();
schema
.is().min(8)                                    // Minimum length 8
.is().max(40)                                  // Maximum length 100
.has().uppercase()                              // Must have uppercase letters
.has().lowercase()                              // Must have lowercase letters
.has().digits(2)                                // Must have at least 2 digits
.has().not().spaces()                           // Should not have spaces
.is().not().oneOf(['Passw0rd', 'Password123']);
exports.deleteUser = (req,res) =>{
  const id = req.userId
  User.destroy({
    where: {id:id}
  })
  .then(num => {
    if (num == 1) {
      res.send({
        message: "Użytkownik został usunięty"
      });
    } else {
      res.send({
        message: `Nie można usunąć użytkownika z id=${id}.`
      });
    }
  })
  .catch(err => {
    res.status(500).send({
      message: "Nie można usunąć użytkownika z id=" + id
    });
  });
};

exports.updateData= (req,res) => {
  User.findOne({where: {id: req.userId}})
  .then (data =>{
    const id = req.userId

    if (req.body.new_password1 != null && req.body.new_password2 != null && req.body.old_password != null){
    
      var passwordIsValid = bcrypt.compareSync(
        req.body.old_password,
        data.password
      ); 
      if (passwordIsValid ) {
        if  (req.body.new_password1 == req.body.new_password2){
          if (schema.validate(req.body.new_password1)==false){
            var mess = ""
            var data = schema.validate(req.body.new_password1, { details: true });
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
        var new_password =  bcrypt.hashSync(req.body.new_password1, 8)
        var dat = {
          "password": new_password
        }
        User.update( dat,{ where: {id: id}
        })
        .then(num => {
          if (num == 1) {
            res.send({
              message: "Pomyślnie zaktualizowano dane"
            });
          } else {
            res.send({
              message: `Nie można zaktualizować użytkownika z id=${id}.`
            });
          };
        })
        .catch(err => {
          res.status(500).send({
            message: "Nie można zaktualizować użytkownika z id=" + id
          });
        });
      }
      else{
        res.status(500).send({
          message: "Podane hasła nie zgadzają się"
        });
      }
    }
      else{
        res.status(500).send({
          message: "Nieprawidłowe hasło"
        });
        return;
      }

    }
    else{
      res.status(500).send({
        message: "Brak danych"
      });
      return;
    }

});
  
};

exports.signup = (req, res) => {
 
  User.create({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    login: req.body.login,
    points : 0,
    password: bcrypt.hashSync(req.body.password, 8)
  })
    .then(user => {
      if (req.body.roles) {

        Role.findOne({
          where: {
            name: req.body.roles
            
          }
        }).then(roles => {
          user.setRoles(roles).then(() => {
            
            res.send({ message: "Użytkownik został pomyślnie dodany" });
          });
        });
      } else {
   
        // user role = 1
        user.setRoles([1]).then(() => {
          res.send({ message: "Użytkownik został pomyślnie dodany" });
        });
      }
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};
exports.signin = (req, res) => {
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
      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400 // 24 hours
      });
      var authorities = [];
      user.getRoles().then(roles => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push("ROLE_" + roles[i].name.toUpperCase());
        }
        res.status(200).send({
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          email:user.email,
          login: user.login,
          email: user.email,
          roles: authorities,
          accessToken: token
        });
      });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};