const db = require("../models");
const { UsersAndsets } = require("../models");
const Set = db.set
const ClassList = db.classList;
const Class = db.class;
const Users = db.user;
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
            return res.status(200).send({ message: "No such class" });
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
      // data = {noStudentsFoundArray: noStudentsFoundArray, StudentsFoundArray: StudentsFoundArray}
      // for (i in students){
      //   console.log("---------------")
      //   console.log(data)
      //   data=check_if_student(students[i],data.noStudentsFoundArray,data.StudentsFoundArray)
        
      // }
      addStudents(students, noStudentsFoundArray,StudentsFoundArray, classId, res)
    }
  })
}
function addStudents(studentIDs, noStudentsFoundArray,StudentsFoundArray, classId, res) {
  array_with_data=[]
  Usernames = []
  for (i in studentIDs ) {
   array_with_data.push({studentId: studentIDs[i], classId: classId})
  }
  try{
  ClassList.bulkCreate(array_with_data).then(()=>{
    return res.status(200).send({"dodano": StudentsFoundArray, "nie znaleziono": noStudentsFoundArray})
  }
  )
  .catch(info=>{
    return res.status(400).send(info)
  }
 
  )
}
catch(error){
  console.log(error)
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
    if (!classInDB) {
      return res.status(200).send({ message: "No such class" });
  }
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
            return res.send(students)
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

function sendResponse(res, students) {
  if (students){
    res.status(200).send({ students });
  }
}
// function check_if_student(id, noStudentsFoundArray,StudentsFoundArray){
//   Users.findByPk(id).then(user => {
//     user.getRoles().then(roles => {
//       for (let i = 0; i < roles.length; i++) {
//         if (roles[i].name === "user") {
         
//           return {noStudentsFoundArray : noStudentsFoundArray, StudentsFoundArray: StudentsFoundArray};
//         }
//       }
//       StudentsFoundArray = StudentsFoundArray.filter(function(item) {
//         return item !== id
//     })
//       noStudentsFoundArray.push(id)
//       const data = {noStudentsFoundArray : noStudentsFoundArray, StudentsFoundArray: StudentsFoundArray}
//       return data
//     });
//   });
// }
exports.delete_student_from_class = (req, res) => {

  ClassList.destroy({ where: { studentId: req.body.studentId, classId: req.body.classId } }).then(info => {
      if (!info) {
          return res.status(200).send("No such student or class");
      }
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
              return res.status(200).send({ message: "No such class" });
          }
          studentsClasses = [];
          for (let i = 0; i < classes.length; i++) {
              Class.findOne({ where: { id: classes[i].classId } }).then(ourClass => {
                  studentsClasses.push(ourClass);
                  console.log(studentsClasses);
                  if (i == classes.length - 1) {
                      return res.send(studentsClasses)
                  }
              })
          }
      })
  }).catch(err => {
      res.status(500).send({ message: err });
  });

}

exports.statistics = (req, res) => {
    UsersAndsets.findAll({ where: { studentId: req.userId } }).then(userSets => {
        sets = [];
        for (let i = 0; i < userSets.length; i++) {
            Set.findOne({ where: { id: userSets[i].setId } }).then(set => {
                sets.push(set);
                console.log(set);
                if (i == userSets.length - 1) {
                    pointsSum = 0;
                    for (let j = 0; j < sets.length; j++) {
                        pointsSum = pointsSum + sets[j].points;
                    }
                    console.log(pointsSum);
                    Users.findOne({ where: { id: req.userId } }).then(user => {
                        userPoints = parseFloat(user.points);
                        maxPoints = parseFloat(pointsSum);
                        console.log(user);
                        console.log(userPoints);
                        percent = (userPoints / maxPoints) * 100;
                        
                        console.log(percent);
                        return res.send({ percent })
                    })
                }
            })
        }
        
    }).catch(err => {
        res.status(500).send({ message: err });
    });
}