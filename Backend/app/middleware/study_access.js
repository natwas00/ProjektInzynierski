const db = require("../models");
const User = db.user;
const Set = db.set;
check_the_owner = (req,res,next)=>{
    Set.findOne({where:{userId: req.userId, id: req.params.setId}}).then(data=>{
        if(data){
            next()
        }
        else{
            return res.status(403).send("Unauthorized access")
        }
        

    })
}

module.exports = check_the_owner