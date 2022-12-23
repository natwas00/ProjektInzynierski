const db = require("../models");
const config = require("../config/auth.config");
var bcrypt = require("bcryptjs");
const User = db.user;
const Role = db.role;
var jwt = require("jsonwebtoken");


exports.deleteUser = (req, res) => {
  const id = req.userId
  User.destroy({
    where: { id: id }
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

exports.updateData = (req, res) => {
  
            var new_password = bcrypt.hashSync(req.body.new_password1, 8)
            var data = {
              "password": new_password
            }
            User.update(data, {
              where: { id: id }
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
          email: user.email,
          login: user.login,
          email: user.email,
          points: user.points,
          roles: authorities,
          accessToken: token
        });
      });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};