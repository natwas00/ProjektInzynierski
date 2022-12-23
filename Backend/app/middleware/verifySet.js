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
if_flashcard_exists = (req, res, next) => {
  const id = req.params.setId;
  fiszki.findOne({
    where: {
      first_side: req.body.first_side, second_side: req.body.second_side, setId: id
    }
  })
    .then(data => {
      if (data) {
        res.status(400).send({message: "Istnieje już taka fiszka"})
        return
      }
      else {
        next()
      }
    })
}
check_flashcard = (req,res,next)=>{
    fiszki.findOne({where: {id: req.params.id}}).then(
      data => {      
        if (data){
          Set.findOne({where: { id: data.setId, userId: req.userId}}).then(
            setdata =>{
              if (!setdata){
                return res.status(403).send({
                  message: `Nieautoryzowany dostęp`
                });
              }
              else if (setdata.points>0){
                return res.status(403).send({
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
check_set = (req, res, next) => {
  var id;
  if (req.params.setId) {
     id = req.params.setId;
  }
  else {
    id = req.params.id
  }
 
    Set.findOne({where:{id: id,
      userId: req.userId}}).then(data2=>{
          if (data2 == null){
            return res.status(403).send({
              message: `Nieautoryzowany dostęp`
            });
            
          }
          else if (req.body.first_side == null || req.body.second_side == null) {
            return res.status(403).send({
              message: 'Brakuje danych'
            });
  }
          else if (data2.points>0){
            return res.status(403).send({
              message: `Nieautoryzowany dostęp`
            });
          }
          else if(req.body.first_side.length != req.body.second_side.length || req.body.first_side.length!=1 ){
            return res.status(400).send({
              message: `Błąd. Zla długość tablicy`
            });
          }
          else{
            next();
          }
          
        })
        
    }
check_create_set = (req,res,next)=>{

            if (req.body.name == null || req.body.name == "" || req.body.level == null || req.body.subject == null ){
                res.status(400).send({ message: "Brakuje danych" });
                return;
              }
            else if (req.body.first_side.length != req.body.second_side.length) {
              res.status(400).send({ message: "Długość tablic first i second side się nie zgadza" });
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
            else{
              next();
            }
     
     
      
}
check_delete_set = (req,res,next)=>{
    Set.findOne({where:{id: req.params.id,
        userId: req.userId}})
        .then(data => {
            if (data==null){
            res.status(404).send({ message: "Błąd" });
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
  let id;
  if (req.params.setId) {
    id = req.params.setId
  }
  else {
    id = req.params.id
  }
  userAndset.findOne({where:{setId: id, studentId: req.userId}}).then(data=>{
      if(data){
         next()
      }
      else{
        Set.findOne({where:{id: id, userId: req.userId}}).then(data2=>{
          if(data2){
             next()
          }
          else{
            res.status(403).send("Nie masz dostępu tego zestawu")
          }
        })
          
      }
     
  })

}
check_sides = (req, res, next) => {
  if (!req.body.first_side || !req.body.second_side) {
    return res.status(400).send({message:"niepełna fiszka"})
  }
  else {
    next()
  }
}
const verifySet = {
    check_set: check_set,
    check_create_set: check_create_set,
    check_delete_set:check_delete_set,
    check_delete_card: check_delete_card,
    check_flashcard: check_flashcard,
    check_access: check_access,
    if_flashcard_exists: if_flashcard_exists,
    check_sides: check_sides
}
module.exports = verifySet;