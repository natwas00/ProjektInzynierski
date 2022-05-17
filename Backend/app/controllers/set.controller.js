const db = require("../models");
const config = require("../config/auth.config");
const { all } = require("express/lib/application");
const Set = db.set;
const Image = db.images;
const fiszki  = db.fiszki;
var alll=[]
exports.add_to_exsist_set = (req,res) =>{
    const id = req.params.id;
    Set.findOne({where:{id: id,
      userId: req.userId}}).then(data2=>{
      
        
          for (i in req.body.first_side){
            fiszki.create({
              first_side: req.body.first_side[i],
              second_side: req.body.second_side[i],
              setId: id,
              link: null
            })
           
          
         
        }
        res.send({ message: "Pomyślnie dodano nowe słowa" });
        return;
      })
  
  };
  exports.all_sets = (req,res) =>{
    Set.findAll({where:{userId: req.userId}}).then(data=>{
      res.send({data });
      return;
    })
    .catch(err => {
      res.status(500).send({ message: "coś nie tak" });
    });
  }
  exports.create_set = (req,res) => {
   
    Set.create({
      name: req.body.name,
      userId: req.userId,
      classId: null,
      level: req.body.level,
      subject:req.body.subject
    }).then (set => {
      Set.findOne({where:{name: req.body.name,
        userId: req.userId}}).then(id => {
             
              for (i in req.body.first_side){
                fiszki.create({
                  first_side: req.body.first_side[i],
                  second_side: req.body.second_side[i],
                  setId: id.id
                })
               
              }
          res.send({ message: "Pomyślnie utworzono zestaw" });
          return;
        }
          )
          .catch(err => {
            res.status(500).send({ message: "coś nie tak" });
          });
          
      });
    
   
    };
exports.deletecards = (req,res) =>{
      const id = req.params.id;
      fiszki.destroy({
        where: {id:id}
      })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Fiszka została pomyślnie usunięta"
          });
        } else {
          res.send({
            message: `Nie można usunąć fiszki`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Nie można usunąc fiszki"
        });
      });
    };
exports.deleteset = (req,res) =>{
      const id = req.params.id;
      Set.destroy({
        where: {id:id}
      })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Zestaw został pomyślnie usunięty"
          });
        } else {
          res.send({
            message: `Nie można usunąć zestawu`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete User with id=" + id
        });
      });
    };
function elosz (cos){
  console.log("elosz cos")
  console.log(cos.dataValues.name)
  alll.push({"siema":cos.dataValues.name})
  //console.log(alll)
  
}
function find_image(data){
  let siema="elo"
   Image.findOne({
    where: {
      id: data.dataValues.imageId
      
    }
  })
 
.then(dataa => {
 // console.log("dataa")
 // console.log(dataa.dataValues.name)
  siema = dataa.dataValues.name
  elosz(dataa)

})
console.log("a no")
console.log(co)
return siema
}
exports.findOneSet = (req, res,next) => {
      alll=[]
      const id = req.params.id;
      fiszki.findAll({
        attributes: ['first_side', 'second_side',"link"],
        where: {
          setId: id
        },
      
      }).then(data =>{
        Set.findOne({where:{id: id,
          userId: req.userId}}).then(data2=>{
          
              if (!data2 ){
                return res.status(404).send({
                  message: `Nieautoryzowany dostęp`
                });
                
              }
              else if (data) {
              
                
                let newData={}
                for (i in data){
               
                    
                    newData = {
                      "first_side":data[i].dataValues.first_side,
                      "second_side": data[i].dataValues.second_side,
                      "link": data[i].link
                    }
                    alll.push(newData)
                   // console.log(alll)
                  
                 
              }
            
              //   console.log(data)
                 res.send(alll);
                 return;
        
               
              } else {
                res.status(404).send({
                  message: `Nie można znaleźć zestawu o id=${id}.`
                });
              }
          }
            )
     
      })
    
    };

    