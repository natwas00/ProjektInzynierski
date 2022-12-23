const { UsersAndsets } = require("../models");
const db = require("../models");
const Group = db.class;
const User = db.user;
const Set = db.set
const class_task = db.class_task;
const ClassList = db.classList;
exports.createGroup = (req, res) => {
   
        Group.create({
            name: req.body.name,
            strudents_number: 0,
            classLevel: req.body.classlevel,
            userId: req.userId
        }).then(group => {
            res.status(201).send({
                message: "success",
                classId: group.id
            });
        })
    .catch(err => {
        res.status(500).send({ message: err.message });
      });
};
exports.delete_class = (req,res) => {
    
    const id = req.userId
    Group.destroy({
      where: {id:req.params.classId}
    })
    .then(num => {
      if (num == 1) {
        return res.status(200).send({
          message: "Klasa została usunięta"
        });
      } else {
        res.send({
          message: `Nie można usunąć tej klasy`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Nie można usunąć tej klasy" 
      });
    });
  };
exports.class_list = (req,res)=>{
    User.findOne({where:{id:req.userId}}).then(user=>{
        Group.findAll({where:{userId: user.id}}).then(classes =>{
            return res.status(200).send(classes)
        })
    })
   
}
exports.class_info = (req,res)=>{
    
    Group.findOne({where:{id: req.params.classId}}).then(info => {
        User.findOne({where: {id: info.userId}}).then(name=>{
            return res.status(200).send({level:info.classLevel, first_name:name.first_name, last_name:name.last_name, name: info.name})
        })
    })
}
exports.class_sets = (req,res)=>{
    Set.findAll({where: {classId: req.params.classId}}).then(data=>{
        return res.status(200).send(data)
    })
}
exports.edit_class_info = (req, res) => {
  groupName = req.body.name;
  groupLevel = req.body.class_level;
  Group.findOne({
      where: {
          id: req.params.classId
      }
  }).then(classInDB => {
      updatedInfo = { name: groupName, classLevel: groupLevel }
      Group.update({ name: groupName, classLevel: groupLevel }, {
          where: { id: classInDB.id }
      }).then(data => {
          return res.status(200).send("Class info is updated")
      })
      })
      .catch(err => {
          res.status(500).send({ message: err.message });
      });
  
}
exports.class_rating = (req, res) => {
    Group.findOne({ where: { id: req.params.classId } }).then(classInDB => {
        ClassList.findAll({ where: { classId: classInDB.id } }).then(students => {
            Set.findAll({ where: { classId: classInDB.id } }).then(sets => {
                if (sets.length == 0) {
                    return res.status(200).send("No sets in class")
                }
                userRates = { }
                for (let i = 0; i < students.length; i++) {

                    for (let j = 0; j < sets.length; j++) {
                        UsersAndsets.findOne({ where: { studentId: students[i].studentId, setId: sets[j].id } }).then(rating => {
                            if (rating) {
                                currentRate = userRates[students[i].studentId]
                                if (currentRate) {
                                    currentRate = currentRate + rating.points
                                } else { currentRate = rating.points }
                                userRates[students[i].studentId] = currentRate
                            }
                            if (i == students.length - 1 && j == sets.length - 1) {
                                users = { };
                                counter = 0;
                                for (var userId in userRates) {
                                    User.findOne({ where: { id: userId } }).then(user => {
                                        
                                        if (!user) {
                                            return res.status(200).send("No such user")
                                        }
                                        
                                        users[user.login] = userRates[user.id]
                                        
                                        counter = counter + 1;
                                        
                                        if (counter == Object.keys(userRates).length) {
                                            return res.send({
                                                users: users
                                            })
                                        }
                                    })
                                }
                                
                            }
                        })
                    }
                }
            })
        })
    })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
}
Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}
exports.add_class_task = (req,res)=>{
    let dat;
    if(!req.body.finishDate){
        dat = new Date().addDays(7)
    }
    else {
        dat = req.body.finishDate
        if (Date.parse(dat) < new Date()) {
            return res.status(400).send({ "message": "Zła data" })
        }
    }
    class_task.create({classId: req.body.classId,
    task: req.body.task, finishDate: dat}).then(ok=>{
        return res.status(200).send({"message":"dodano"})
    })
    .catch(error=>{
        console.log(error)
    })
}
exports.all_tasks = (req,res)=>{
    class_task.findAll({where: {classId: req.params.classId}}).then(tasks=>{
        return res.status(200).send(tasks)
    })
    .catch(error=>{
        console.log(error)
    })
}
exports.delete_task = (req,res)=>{
    class_task.destroy({where: {id: req.params.id}}).then(task=>{
        return res.status(200).send("usunieto")
    })
    .catch(error=>{
        console.log(error)
    })
}
