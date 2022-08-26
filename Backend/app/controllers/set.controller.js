const db = require("../models");
const Set = db.set;
const { Op } = require("sequelize");

const Image = db.images;
const fiszki  = db.fiszki;
const update_acess = require('./last_access.controller')
const UsersAndsets = db.UsersAndsets;
const fs = require("fs");
const csv = require("fast-csv");
const CsvParser = require("json2csv").Parser;
var all=[]
const User = db.user;
const path = require("path");
const Path = path.join(`${__dirname}/../resources/static/assets/uploads/`)

function last_access(setId, userId){
  date = {last_access : new Date()}
  UsersAndsets.update(date, {where:{studentId: userId, setId: setId}}).then(()=>{
      console.log("zmieniono czas ostatniego dostępu")
  })
  .catch(()=>{
      console.log("error")
  })
}
exports.downloadCsv= (req, res) => {
  all=[]
  const id = req.params.id;
  fiszki.findAll({
    attributes: ['first_side', 'second_side'],
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
            let flashcards = [];
            
            
            data.forEach((obj)=> {
              const {first_side, second_side} = obj;
              flashcards.push({first_side, second_side});
            })
            const csvFields = ["first_side", "second_side"]
            const csvParser = new CsvParser({ csvFields });
            const csvData = csvParser.parse(flashcards);

            res.setHeader("Content-Type", "text/csv");
            res.setHeader("Content-Disposition", "attachment; filename=words.csv");

            res.status(200).end(csvData);
            
      }
        
 
  })

})
}
exports.uploadCsvToDatabase = async (req, res) => {
  try {
    if (req.file == undefined) {
      return res.status(400).send("Please upload a CSV file!");
    }

    let words = [];
    let path =  Path + req.file.filename;

    fs.createReadStream(path)
      .pipe(csv.parse({ headers: true }))
      .on("error", (error) => {
        throw error.message;
      })
      .on("data", (row) => {
        words.push(row);
      })
      .on("end", () => {
        for (i in words){
          if (words[i].first_side && words[i].second_side){
            var data = {
              "first_side": words[i].first_side,
              "second_side": words[i].second_side,
              "setId": req.params.id
            }
            fiszki.create(data)
            .catch((error) => {
              res.status(500).send({
                message: "Fail to import data into database!",
                error: error.message,
              });
            });
          }
          }  
          res.status(200).send({
            message: "Dodano nowe słowa"
           } );
           try{
            last_access(req.params.id,req.userId)

           }
           catch{
            console.log("error")
           }
          
          
  
      });
    
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Could not upload the file: " + req.file.originalname,
    });
  }
};
exports.uploadCsv = async (req, res) => {
  try {
    if (req.file == undefined) {
      return res.status(400).send("Please upload a CSV file!");
    }

    let words = [];
    let path =  Path + req.file.filename;

    fs.createReadStream(path)
      .pipe(csv.parse({ headers: true }))
      .on("error", (error) => {
        throw error.message;
      })
      .on("data", (row) => {
        words.push(row);
      })
      .on("end", () => {
        
            res.status(200).send(
            words
            );
          
  
      });
     
      
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Could not upload the file: " + req.file.originalname,
    });
  }
};
exports.add_to_exsist_set = (req,res) =>{
    const id = req.params.setId;
    fiszki.findOne({where:{ 
      first_side: req.body.first_side, second_side: req.body.second_side, setId: id}})
    . then(data=>{
      if (data){
        res.status(400).send("Istnieje już taka fiszka")
        return
      }
      else{
      //  Set.findOne({where:{id: id}}).then(data2=>{
            fiszki.create({
              first_side: req.body.first_side[0],
              second_side: req.body.second_side[0],
              setId: id,
              link: null
            }).then(id =>{
              res.send({ message: "Dodano fiszkę", id: id.id });
              return;
            })
            try{
              last_access(id,req.userId)
  
             }
             catch{
              console.log("error")
             }
           
       
          
        //  })
      }
     
      
    })

  
  };
exports.all_sets = (req,res) =>{
    User.findAll({where:{id: req.userId}, 
      include: Set}).then(data=>{
      res.send(data[0].sets);
      return;
    })
    .catch(err => {
      res.status(500).send({ message: err });
    });
  }
exports.create_set = (req,res) => {
    Set.create({
      name: req.body.name,
     // userId: req.userId,
      classId: null,
      level: req.body.level,
      subject:req.body.subject,
      points: 0
    }).then (set => {
              array_with_data=[]
              for (let i = 0; i < req.body.first_side.length; i++){
                //array_with_data=[]
                array_with_data.push({
                  first_side: req.body.first_side[i],
                  second_side: req.body.second_side[i],
                  setId: set.id
                })
               
               
              }
              if (array_with_data){
                fiszki.bulkCreate(
                  array_with_data
                ).then(data=>{
                  
                })

            }
              setData = {
                id: set.id,
                message: "Utworzono zestaw"
              }
              var userAndset = {studentId: req.userId,setId: set.id}
              UsersAndsets.create(userAndset).then(()=>{
                console.log("ok dodano")
              })
              .catch(err=>{
                res.status(400).send("error")
              })
              res.send(setData);
              try{
                last_access(set.id,req.userId)
    
               }
               catch{
                console.log("error")
               }
              return;
            
          

          
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
exports.editFlashcard = (req, res) =>{
  id = req.params.id;
  fiszki.findOne({where:{id: id}}).then(dat=>{ 
  fiszki.findOne({where:{ 
    id:{[Op.ne]:id},first_side: req.body.first_side, second_side: req.body.second_side, setId: dat.setId}})
  . then(data=>{
    if (data){
      res.status(400).send("Istnieje już taka fiszka")
      return
    }
    else{
      var Dat = {
        "first_side": req.body.first_side,
        "second_side": req.body.second_side
      }
      fiszki.update( Dat,{ where: {id: id}
      })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Pomyślnie zaktualizowano dane"
          });
        } else {
          res.send({
            message: `Nie można zaktualizować fiszki z id=${id}.`
          });
        };
        try{
          last_access(dat.setId,req.userId)

         }
         catch{
          console.log("error")
         }
    
    })
    }
  })
  })
}
exports.find_set_name = (req,res) =>{
  const id = req.params.setId;
  Set.findOne({
    attributes: ['name'],
    where: {
      id: id
    }
  }).then (name =>{
    res.send(name)
    return;
  })
}
exports.findOneSet = (req, res) => {
      all=[]
      const id = req.params.setId;
      fiszki.findAll({
        attributes: ['id','first_side', 'second_side','link'],
        where: {
          setId: id,
        },
        order: [
          ['id', 'DESC'],
          
      ],
      
      }).then(data =>{
        Set.findOne({where:{id: id}}).then(data2=>{
          
              if (!data2 ){
                return res.status(404).send({
                  message: `Błąd`
                });
                
              }
              else if (data) {
                 res.send(data);
                 try{
                  last_access(id,req.userId)
      
                 }
                 catch{
                  console.log("error")
                 }
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

    