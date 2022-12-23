const db = require("../models");
const Class = db.class;
const Task = db.class_task;
checkClassOwner = (req,res,next) =>{
    Class.findOne({where:{userId: req.userId, id: req.body.classId}}).then(data=>{
        if(data){
            next()
        }
        else{
            return res.status(403).send("Brak dostępu do zasobu")
        }
    })
}
checkClassOwner2 = (req,res,next) =>{
    Class.findOne({where:{userId: req.userId, id: req.params.classId}}).then(data=>{
        if(data){
            next()
        }
        else{
            return res.status(403).send("Brak dostępu do zasobu")
        }
    })
}
check_fields = (req, res, next) => {
    if (req.body.name == null || req.body.classlevel == null) {
        return res.status(400).send({message:"Brakuje danych"})
    }
    else {
        next()
    }
}
check_class_name = (req, res, next) => {
    Class.findOne({
        where: {
            name: req.body.name, userId : req.userId
        }
    })
        .then(group => {
            if (group) {
                return res.status(200).send({ message: "Group with such name already has been created" });
            }
            else {
                next()
            }
        })
}
const check_delete_task = (req, res, next) => {
    Task.findOne({ where: { id: req.params.id } }).then(data => {
        Class.findOne({ where: { id: data.classId, userId: req.userId } }).then(data2 => {
            if (data2) {
                next()
            }
            else {
                return res.status(400).send({message:"Brak dostępu do zasobu"})
            }
        })
    })
}
const verifyTeacher = {
    checkClassOwner: checkClassOwner,
    checkClassOwner2: checkClassOwner2,
    check_class_name: check_class_name,
    check_fields: check_fields,
    check_delete_task:check_delete_task
  };
  module.exports = verifyTeacher;