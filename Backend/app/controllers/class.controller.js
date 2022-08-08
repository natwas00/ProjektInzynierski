const db = require("../models");
const Group = db.class;

exports.createGroup = (req, res) => {
    Group.findOne({
        where: {
            name: req.body.name
        }
    })
    .then(group => {
        if (group) {
            return res.status(200).send({ message: "Group with such name already has been created" });
        }
        Group.create({
            name: req.body.name,
            strudents_number: 0,
            classLevel: req.body.classlevel,
            userId: req.body.userId
        }).then(() => {
            res.status(200).send({ message: "success" });
          });
        
    })
    .catch(err => {
        res.status(500).send({ message: err.message });
      });
};