
const db = require("../models");
const notification = db.notification;
 check_owner = (req,res,next)=>{
    notification.findOne({where:{userId:req.userId, id: req.params.id}}).then(data=>{
        if(data){
            next()
        }
        else{
            return res.status(400).send("error")
        }
    })
 }
 const verifyNor = {
    check_owner:check_owner
 }
 module.exports = verifyNor