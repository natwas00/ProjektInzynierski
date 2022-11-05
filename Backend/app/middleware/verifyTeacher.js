const db = require("../models");
const Class = db.class;
checkClassOwner = (req,res,next) =>{
    Class.findOne({where:{userId: req.userId, id: req.body.classId}}).then(data=>{
        if(data){
            next()
        }
        else{
            return res.status(401).send("Brak dostępu do zasobu")
        }
    })
}
checkClassOwner2 = (req,res,next) =>{
    Class.findOne({where:{userId: req.userId, id: req.params.classId}}).then(data=>{
        if(data){
            next()
        }
        else{
            return res.status(401).send("Brak dostępu do zasobu")
        }
    })
}
const verifyTeacher = {
    checkClassOwner: checkClassOwner,
    checkClassOwner2: checkClassOwner2
    
  };
  module.exports = verifyTeacher;