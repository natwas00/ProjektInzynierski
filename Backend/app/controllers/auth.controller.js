const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;
const Op = db.Sequelize.Op;
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
        message: "User was deleted successfully!"
      });
    } else {
      res.send({
        message: `Cannot delete User with id=${id}.`
      });
    }
  })
  .catch(err => {
    res.status(500).send({
      message: "Could not delete User with id=" + id
    });
  });
};

exports.updateData= (req,res) => {
  User.findOne({where: {id: req.userId}})
  .then (data =>{
    const id = req.userId
    // if (id != req.userId){
    //   res.status(500).send({
    //     message: "Not your data"
    //   });
    //   return;
    // }
    if (req.body.password != null){
      if (schema.validate(req.body.password)==false){
        res.status(400).send({
              message: schema.validate(req.body.password, { details: true })
             });
             return;
      }
      req.body.password =  bcrypt.hashSync(req.body.password, 8)
    }
    User.update( req.body,{ where: {id: id}
  })
  .then(num => {
    if (num == 1) {
      res.send({
        message: "User was updated successfully."
      });
    } else {
      res.send({
        message: `Cannot update user with id=${id}. Maybe Tutorial was not found or req.body is empty!`
      });
    };
  })
  .catch(err => {
    res.status(500).send({
      message: "Error updating user with id=" + id
    });
  });
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

        Role.findAll({
          where: {
            name: {
              [Op.or]: req.body.roles
            }
          }
        }).then(roles => {
          user.setRoles(roles).then(() => {
            
            res.send({ message: "User was registered successfully! :)" });
          });
        });
      } else {
        console.log("nie weszło")
        // user role = 1
        user.setRoles([1]).then(() => {
          res.send({ message: "User was registered successfully!!!" });
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
        return res.status(404).send({ message: "User Not found." });
      }
      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );
      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
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