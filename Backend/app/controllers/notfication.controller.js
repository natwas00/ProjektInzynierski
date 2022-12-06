const db = require("../models");
const notification = db.notification;

exports.read_notification = (req,res)=>{
    notification.update({if_read:"yes"},{where:{id:req.params.id}}).then(()=>{
        return res.status(200).send("ok")
    }
    )
}
exports.show_notification = (req,res)=>{
    notification.findAll({where:{userId: req.userId}}).then(data=>{
        res.status(200).send(data)
    })
}
exports.delete_notification = (req,res)=>{
    notification.destroy({where:{id: req.params.id}}).then(()=>{
        res.status(200).send("usunięto")
    })
}