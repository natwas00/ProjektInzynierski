const db = require("../models");
const Set = db.set;
const Image = db.images;
const fiszki  = db.fiszki;
const fs = require("fs");
const csv = require("fast-csv");
const CsvParser = require("json2csv").Parser;
var all=[]
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
            res.setHeader("Content-Disposition", "attachment; filename=tutorials.csv");

            res.status(200).end(csvData);
      }
        
 
  })

})
}
exports.uploadCsv = async (req, res) => {
  try {
    if (req.file == undefined) {
      return res.status(400).send("Please upload a CSV file!");
    }

    let tutorials = [];
    let path =  Path + req.file.filename;

    fs.createReadStream(path)
      .pipe(csv.parse({ headers: true }))
      .on("error", (error) => {
        throw error.message;
      })
      .on("data", (row) => {
        tutorials.push(row);
      })
      .on("end", () => {
        
            res.status(200).send(
            tutorials
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
      res.send(data);
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

exports.findOneSet = (req, res,next) => {
      all=[]
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
                    all.push(newData)
                  
                 
              }
                 res.send(all);
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

    