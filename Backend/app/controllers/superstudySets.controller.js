const db = require("../models");
const { Op } = require("sequelize");

const Set = db.set;
const User = db.user;
const UsersAndsets = db.UsersAndsets
exports.buySuperStudySet = (req,res) =>{
    User.findOne({where:{id: req.userId}}).then(user =>{
        Set.findOne({where:{id: req.params.setId}}).then(set=>{
            if (set.points > user.points){
                return res.status(400).send("Nie posiadasz wystarczająco dużo punktów");
            }
            else{
                let new_points = parseInt(user.points) - parseInt(set.points);
                const update = {points: new_points};
                User.update(update,{ where:{id:user.id}}).then(num => {
                    if (num == 1) {
                    const data = {studentId: req.userId, setId: req.params.setId}
                    UsersAndsets.create(data).then(()=>{
                        res.send({
                                    message: "Kupiono nowy zestaw!"
                                })
                    })
                    } else {
                      res.send({
                        message: `Nie można zaktualizować użytkownika z id=${id}.`
                      });
                    };
                  })

            }
        })
    })
}
exports.list_superstudy_sets = (req,res)=>{
    const sets_to_send = []
    UsersAndsets.findAll({where:{studentId: req.userId, setId:{[Op.or]:[1,2,3]}}}).then(data=>{
        Set.findAll({where:{id:{[Op.or]:[1,2,3]}}}).then(sets=>{
            const t = data.map(function(e){return e.setId})
            console.log(t)
            for (let i=0;i<sets.length;i++){
               if (t.includes(sets[i].id)){
                     sets_to_send.push({id: sets[i].id,name: sets[i].name,points: sets[i].points,link: sets[i].link,subject: sets[i].subject, if_bought:true})
                 }
                 else{
                    sets_to_send.push({id: sets[i].id,name: sets[i].name, points: sets[i].points, link: sets[i].link,subject: sets[i].subject, if_bought:false})

                 }
            }
           
            // for(let set in sets){
            //     if (set in data){
            //         console.log("----------------------")
            //         console.log(set)
            //     }
            // }
            return res.send(sets_to_send)
        })
       
    })
    
}