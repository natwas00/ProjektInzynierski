const sequelize = require("sequelize");
const db = require("../models");
const { Op } = require("sequelize");
const ClassList = db.classList;
const Class = db.class;
const Users = db.user;
const set = db.set;
const notification = db.notification;
const UsersAndsets = db.UsersAndsets;


const fiszki = db.fiszki;
students = [];
StudentsFoundArray = []
noStudentsFoundArray = [];
existingUser = [];
checkedStudentIds = [];
exports.addStudents = (req, res) => {
    StudentsFoundArray = []
    noStudentsFoundArray = [];
    existingUser = [];
    checkedStudentIds = [];
    students = [];
    Class.findOne({
        where: {
            id: req.body.classId
        }
    })
    .then(classInDB => {
        if (!classInDB) {
            return res.status(404).send({ message: "No such class" });
        }
        
      for (let i = 0; i < req.body.students.length; i++) {
          studentLogin = req.body.students[i]
          findStudent(studentLogin, i, req.body.students.length, req.body.classId, res)
        } 
    })
    .catch(err => {
        res.status(500).send({ message: err.message });
      });
};

function findStudent(studentLogin, loopCount, studentCount, classId, res) {
  console.log(loopCount, " ", studentCount)
  let data;
    Users.findOne({
      where: {
        login: studentLogin
      }
    }).then(student => {
    
      if (!student) {
        noStudentsFoundArray.push(studentLogin)
      } else {
        students.push(student.id)
        StudentsFoundArray.push(studentLogin)
   
      }
      if (loopCount == studentCount - 1) {

        addStudents(students, noStudentsFoundArray, StudentsFoundArray, classId, res)
      }
    })
  }


function addStudents(studentIDs, noStudentsFoundArray,StudentsFoundArray, classId, res) {
  array_with_data=[]
  Usernames = []
  for (let i=0; i< studentIDs.length;i++ ) {
   array_with_data.push({studentId: studentIDs[i], classId: classId})

  }

 
  try{
    ClassList.bulkCreate(array_with_data).then(() => {
    for (let i=0; i< studentIDs.length;i++ ) {
    notification.create({content: "Zostałeś/aś dodany/a do nowej klasy!", classId: classId, setId: null, userId: studentIDs[i],  if_read:"no"}).then(()=>{
  })

  }

   add_sets_to_students(classId, studentIDs)
    return res.status(200).send({"dodano": StudentsFoundArray, "nie znaleziono": noStudentsFoundArray})
  }
  )
  .catch(info=>{
    return res.status(500).send("error")
  }
 
  )
    

}
catch(error){
    return res.status(400).send({ "message": "error" })
    
  }
   
 
}



exports.getStudentsFromClass = (req, res) => {
  {
    Class.findOne({
      where: {
          id: req.params.classId
      }
  })
  .then( classInDB => {
 
    students = []
    ClassList.findAll({
      where:{
        classId: classInDB.id
      }
    })
    .then(data=>{
      dataCount = 0
      data.forEach(element => {
        dataCount = dataCount + 1
      });
      for (let i = 0; i < dataCount; i++) {
        Users.findOne({
          where: {
            id: data[i].studentId
          }
        })
        .then(student => {
          students.push({
            studentId: student.id,
            first_name: student.first_name,
            last_name:student.last_name,
            login: student.login
          });
          if (i == dataCount - 1) {
            return res.status(200).send(students)
          }
        })
      }
    })
  })
    
    .catch(err => {
      res.status(500).send({ message: err });
    });
  }
};


exports.delete_student_from_class = (req, res) => {

  ClassList.destroy({ where: { studentId: req.body.studentId, classId: req.body.classId } }).then(info => {
  
      return res.send("The student was deleted from the class")
  })
      .catch(error => {
          res.send(error)
      })
}
exports.student_classes = (req, res) => {
  Users.findOne({ where: { id: req.userId } }).then(user => {
      ClassList.findAll({ where: { studentId: user.id } }).then(classes => {            
          if (classes.length == 0) {
              return res.status(404).send({ message: "Brak klas do wyświetlenia" });
          }
          studentsClasses = [];
          for (let i = 0; i < classes.length; i++) {
              Class.findOne({ where: { id: classes[i].classId } }).then(ourClass => {
                  studentsClasses.push(ourClass);
                  console.log(studentsClasses);
                  if (i == classes.length - 1) {
                      return res.status(200).send(studentsClasses)
                  }
              })
          }
      })
  }).catch(err => {
      res.status(500).send({ message: err });
  });

}
function add_sets_to_students(classId, students){
  set.findAll({where: {classId: classId}}).then(data=>{
    console.log(data.length)
    for (let i=0;i<data.length;i++){
      for (let j=0;j<students.length;j++){
      UsersAndsets.create({studentId: students[j], setId: data[i].id}).then(()=>{
         console.log("ok dodano")
      //   res.status(201).send("ok");
      
       })
      }
    }
  })
}
exports.statistics = (req, res) => {
  UsersAndsets.findAll({ where: { studentId: req.userId} }).then(userSets => {
      let sets = [];
      if (userSets.length == 0) {
          return res.status(200).send({ message: "User has no final tests" });
      }
      for (let i = 0; i < userSets.length; i++) {
        if (userSets[i].points!=null){
          sets.push(userSets[i].setId)
        }
        
      }
      fiszki.findAndCountAll({
        where:{setId:{[Op.in]:sets}}
      }).then(dat=>{
        console.log(sets)
       // res.send(dat)
       Users.findOne({ where: { id: req.userId } }).then(user => {

        if (user.points == null) {
          percent = 0
          return res.send({ percent  })
        }
        
      userPoints = parseFloat(user.points);
      maxPoints = parseFloat(dat.count);
      percent = (userPoints / maxPoints) * 100;
      return res.send({ percent })
      });
    })
  })
}