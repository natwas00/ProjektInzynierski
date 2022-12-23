const db = require("../models");
const UsersAndsets = db.UsersAndsets
const Set = db.set
check_owner = (req,res,next)=>{
    UsersAndsets.findOne({where:{setId: req.params.setId, studentId: req.userId}}).then(data=>{
        if(data){
            return res.status(409).send("Masz już ten zestaw")
        }
        else{
            next()
        }
    })
}
check_access = (req,res,next)=>{


    UsersAndsets.findOne({where:{setId: req.params.setId, studentId: req.userId}}).then(data=>{
        if(data){
           next()
        }
        else{
            res.status(403).send("Nie masz dostępu tego zestawu")
        }
       
    })

}
const verifySuperStudySet = {
    check_owner: check_owner,
    check_access: check_access
}
module.exports = verifySuperStudySet