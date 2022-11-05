const db = require("../models");
const config = require("../config/auth.config");
const { fiszki, set } = require("../models");
const { Op } = require("sequelize");
const Set = db.set;
var levels = new Array("Szkoła podstawowa","Liceum","Technikum","Inny")
var subjects =  new Array("Język angielski","Język niemiecki","Język hiszpański","Język francuski")
const SetData  = db.fiszki;
const userAndset = db.UsersAndsets
function check_level(level){
    var value=false
    for (element in levels){
      if (levels[element] == level){
        value=true
     
      }
    }
    return value
  }
  function check_subject(subject){
    var value=false
    for (element in subjects){
      if (subjects[element] == subject){
        value=true
     
      }
    }
    return value
  }
check_flashcard = (req,res,next)=>{
    fiszki.findOne({where: {id: req.params.id}}).then(
      data => {
        // console.log(data)
        // return res.status(404).send({
        //   message: "elo"
        // });
       
        if (data){
          userAndset.findOne({where: { setId: data.setId}}).then(
            setdata =>{
              console.log(setdata.userId)
              console.log(req.userId)
              if (setdata.studentId != req.userId){
                return res.status(401).send({
                  message: `Nieautoryzowany dostęp`
                });
              }
              else if ([1,2,3].includes(parseInt(setdata.setId))){
                return res.status(401).send({
                  message: `Nieautoryzowany dostęp`
                });
              }
              else{
                next();
              }
              
            }
          )
        }
        else{
          return res.status(404).send({
            message: "Podana fiszka nie istnieje"
          });
          

        }
      }
    )
    .catch ( err =>{
      return res.status(404).send({
        message: err
      });
    })
}
check_set = (req,res,next)=>{
    const id = req.params.setId;
    userAndset.findOne({where:{setId: id,
      studentId: req.userId}}).then(data2=>{
          if (data2 == null){
            return res.status(401).send({
              message: `Nieautoryzowany dostęp`
            });
            
          }
          else if ([1,2,3].includes(parseInt(id))){
            return res.status(401).send({
              message: `Nieautoryzowany dostęp`
            });
          }
          else if(req.body.first_side.length != req.body.second_side.length){
            return res.status(400).send({
              message: `Błąd`
            });
          }
          else{
            next();
          }
          
        })
        
    }
check_create_set = (req,res,next)=>{

            if (req.body.name == null || req.body.name == "" || req.body.level == null || req.body.subject == null){
                res.status(400).send({ message: "Brakuje danych" });
                return;
              }
            
            else if (!check_level(req.body.level)){
                res.status(400).send({ message: "Należy podać odpowiedni poziom" });
                return;
              }
            else if (!check_subject(req.body.subject)){
                res.status(400).send({ message: "Należy podać odpowiedni przedmiot" });
                return;
              }
            // else if (req.body.first_side == null || req.body.second_side == null){
            //     res.status(400).send({ message: "Brakuje danych" });
            //     return;
            //   }
              next();

     
     
      
}
check_delete_set = (req,res,next)=>{
    userAndset.findOne({where:{setId: req.params.setId,
        studentId: req.userId}})
        .then(data => {
            if (data==null){
            res.status(404).send({ message: "Podany zestaw nie istnieje" });
            return;
            }
            else{
              next();
            }
           
        })
        
}
check_delete_card = (req,res,next)=>{
  
    SetData.findAll({where:{id: req.params.id,
       }})
        .then(data => {
            if (data.length == 0){
           
            res.status(404).send({ message: "Podana fiszka nie istnieje" });
            return ;
            
            }
            else{
                
            Set.findOne({where:{id: data.setId,
                userId: req.userId}})
                .then(data => {
                    if (data==null){
                    res.status(404).send({ message: "Podana fiszka nie istnieje" });
                    return;
                    }
                })
            }
            next();
            
        })
        
}
check_access = (req,res,next)=>{


  userAndset.findOne({where:{setId: req.params.setId, studentId: req.userId}}).then(data=>{
      if(data){
         next()
      }
      else{
          res.status(401).send("Nie masz dostępu tego zestawu")
      }
     
  })

}
const verifySet = {
    check_set: check_set,
    check_create_set: check_create_set,
    check_delete_set:check_delete_set,
    check_delete_card: check_delete_card,
    check_flashcard: check_flashcard,
    check_access: check_access
}
module.exports = verifySet;