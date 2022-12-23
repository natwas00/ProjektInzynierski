const db = require("../models");
const Set = db.set;
const { Op } = require("sequelize");
const ClassList = db.classList;
const notification = db.notification;
const Image = db.images;
const fiszki  = db.fiszki;
const UsersAndsets = db.UsersAndsets;
const fs = require("fs");
const csv = require("fast-csv");
const CsvParser = require("json2csv").Parser;
var all=[]
const User = db.user;
const path = require("path");
const Path = path.join(`${__dirname}/../resources/static/assets/uploads/`)

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
            return res.status(431).send({
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

    let words = [];
    let path =  Path + req.file.filename;

    fs.createReadStream(path)
      .pipe(csv.parse({ headers: true }))
      .on("error", (error) => {
        throw error.message;
      })
      .on("data", (row) => {
        row.setId = req.params.id
        words.push(row);
      })
      .on("end", () => {
      
        fiszki.bulkCreate(words).then(()=> {
            return res.status(201).send({
            message: "Dodano nowe słowa"
           } );
            })
            .catch((error) => {
              res.status(500).send({
                error: error.message
              });
            });
          })    
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Nie można załadować pliku" ,
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
    fiszki.create({
              first_side: req.body.first_side[0],
              second_side: req.body.second_side[0],
              setId: id,
              link: null
            }).then(id =>{
              res.status(201).send({ message: "Dodano fiszkę", id: id.id });
              return;
            })
            

  
  };
exports.all_sets = (req,res) =>{
  const { page, size } = req.query;
  const { limit, offset } = getPagination(page, size);
  UsersAndsets.findAll({attributes:['setId'],where:{studentId: req.userId}}).then(data=>{
    array = []
    for(let i=0;i<data.length;i++){

      array.push(data[i].dataValues.setId)

    }
    Set.findAndCountAll({where:{id: array}, limit, offset}).then(data2=>{
      const response = getPagingData(data2, page, limit);
      res.status(200).send(response);
      return;
    })
    .catch(err => {
      res.status(500).send({ message: err });
    });
   
  })
  
  }
exports.create_set = (req,res) => {
    let classId;
    if (req.body.classId){
      classId = req.body.classId
    }
    else{
      classId = null
    }
    Set.create({
      name: req.body.name,
      userId: req.userId,
      classId: classId,
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
             
           
              if (classId != null){
                ClassList.findAll({where: {classId: classId}}).then(data=>{
                  console.log(data.length)
                  for (let i=0;i<data.length;i++){
                    UsersAndsets.create({studentId: data[i].studentId, setId: set.id}).then(()=>{
                       
                     })
                     notification.create({content: "Został stworzony nowy zestaw w klasie", classId: classId, setId: set.id, userId: data[i].studentId, if_read:"no"}).then(()=>{

                     })

                  }
                  UsersAndsets.create({studentId: req.userId, setId: set.id}).then(()=>{
                    res.status(201).send(setData);
                    
                  })
                  
                })

              }
              else{
                var userAndset = {studentId: req.userId,setId: set.id}
                UsersAndsets.create(userAndset).then(()=>{
                  res.status(201).send(setData);
                })
                .catch(err=>{
                  res.status(500).send("error")
                })
               
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
          res.status(400).send({
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
          res.status(200).send({
            message: "Zestaw został pomyślnie usunięty"
          });
        } else {
          res.status(400).send({
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
          res.status(200).send({
            message: "Pomyślnie zaktualizowano dane"
          });
        } else {
          res.status(400).send({
            message: `Nie można zaktualizować fiszki z id=${id}.`
          });
        };
      
    
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
                 res.status(200).send(data);
                 return;
     
      })
    
    };
    const getPagingData = (data, page, limit) => {
      const { count: totalItems, rows: sets } = data;
      const currentPage = page ? +page : 0;
      const totalPages = Math.ceil(totalItems / limit);
    
      return { totalItems, sets, totalPages, currentPage };
    };
    const getPagination = (page, size) => {
      const limit = size ? +size : 3;
      const offset = page ? page * limit : 0;
    
      return { limit, offset };
};
    const getPagingData1 = (count,rows, page, limit) => {
   // const { count: totalItems, rows: sets } = data;
    const totalItems = count;
    const sets = rows;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);

    return { totalItems, sets, totalPages, currentPage };
};
exports.filter = (req, res) => {
    const { page, size } = req.query;
    const { limit, offset } = getPagination(page, size);

    UsersAndsets.findAll({ attributes: ['setId'], where: { studentId: req.userId } }).then(data => {
        array = []
        for (let i = 0; i < data.length; i++) {
            array.push(data[i].dataValues.setId)

        }
        let sets = [];
        Set.findAll({ where: { id: array } }).then(ourSets => {
            console.log(ourSets)
            for (let m = 0; m < ourSets.length; m++) {

                if (req.body.filter == 1) { //SuperStudy sets
                    if (ourSets[m].points != 0) {
                        console.log("------------")
                        sets.push(ourSets[m])

                    }
                }
                if (req.body.filter == 2) {
                    if (ourSets[m].classId != null) { //Class sets
                        console.log("------------")
                        sets.push(ourSets[m])

                    }
                }
                if (req.body.filter == 3) {
                    if (ourSets[m].points == 0 && ourSets[m].classId == null) { //Own user sets
                        console.log("------------")
                        sets.push(ourSets[m])

                    }
                }
                if (m == ourSets.length - 1) {
                    console.log(sets);
                    const response = getPagingData1(sets.length,sets, page, limit);
                    return(res.send(response))
                }
            }

        })

            .catch(err => {
                res.status(500).send({ message: err });
            });

    })

}
exports.getPoints = (req,res)=>{
  User.findOne({where:{id:req.userId}}).then(data=>{
    return res.status(200).send({points:data.points})
  })
}
  