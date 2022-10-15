const { UsersAndsets } = require("../models");
const db = require("../models");
const Group = db.class;
const User = db.user;
const Set = db.set
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
                userId: req.userId
            }).then(() => {
                Group.findOne({
                    where: {
                        name: req.body.name
                    }
                }).then(group => {
                    res.status(200).send({
                        message: "success",
                        classId: group.id
                    });
                })
            });

        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
};
exports.delete_class = (req, res) => {

    Group.destroy({ where: { id: req.params.classId } }).then(info => {
        return res.send("usunieto")
    })
        .catch(error => {
            res.send(error)
        })
}
exports.class_list = (req, res) => {
    User.findOne({ where: { id: req.userId } }).then(user => {
        Group.findAll({ where: { userId: user.id } }).then(classes => {
            return res.send(classes)
        })
    })

}
exports.class_info = (req, res) => {

    Group.findOne({ where: { id: req.params.classId } }).then(info => {
        User.findOne({ where: { id: info.userId } }).then(name => {
            return res.send({ level: info.classLevel, first_name: name.first_name, last_name: name.last_name })
        })
    })
}
exports.class_sets = (req, res) => {
    Set.findAll({ where: { classId: req.params.classId } }).then(data => {
        return res.status(200).send(data)
    })
}
exports.edit_class_info = (req, res) => {
    groupName = req.body.name;
    groupLevel = req.body.class_level;
    Group.findOne({
        where: {
            id: req.params.classId
        }
    }).then(classInDB => {
        if (!classInDB) {
                return res.status(200).send({ message: "No such class" });
               
            }
        updatedInfo = { name: groupName, classLevel: groupLevel }
        Group.update({ name: groupName, classLevel: groupLevel }, {
            where: { id: classInDB.id }
        }).then(data => {
            return res.status(200).send("Class info is updated")
        })
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
    
}