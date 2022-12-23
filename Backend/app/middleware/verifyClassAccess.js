const db = require("../models");
const Class = db.class;
const ClassList = db.classList;
checkAccess = (req, res, next) => {
    Class.findOne({ where: { userId: req.userId, id: req.body.classId } }).then(data => {
        if (data) {
            next()
        }
        else {
            ClassList.findOne({ where: { classId: req.body.classId, studentId: req.userId } }).then(data2 => {
                if (data2) {
                    next()
                }
                else {
                    res.status(403).send("Nie masz dostêpu do tych danych")
                }
            })

        }

    })

}
checkAccess1 = (req, res, next) => {
    Class.findOne({ where: { userId: req.userId, id: req.params.classId } }).then(data => {
        if (data) {
            next()
        }
        else {
            ClassList.findOne({ where: { classId: req.params.classId, studentId: req.userId } }).then(data2 => {
                if (data2) {
                    next()
                }
                else {
                    res.status(403).send("Nie masz dostêpu do tych danych")
                }
            })

        }

    })

}


const verifyClassAccess = {
    checkAccess: checkAccess,
    checkAccess1: checkAccess1

};
module.exports = verifyClassAccess;