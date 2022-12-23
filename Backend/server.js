const express = require("express");
const nodeCron = require("node-cron");
const { Op } = require("sequelize");
const cors = require("cors");
const { fiszki } = require("./app/models");
const db = require("./app/models");
const Role = db.role;
const Set = db.set;
const app = express();
var corsOptions = {
  origin: "http://localhost:8081"
};
app.use(cors(corsOptions));
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

db.sequelize.sync({force:false}).then(() => { 
  console.log('Drop and Resync Db');
 // initial()
  //createSuperstudysets()
});


require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/set.routes')(app);
require('./app/routes/image.upload.routes')(app);
require('./app/routes/class.routes')(app);
require('./app/routes/superstudyset.routes')(app);
require('./app/routes/study.routes')(app);
require('./app/routes/not.routes')(app);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

function initial() {
  Role.create({
    id: 1,
    name: "user"
  });
 
  Role.create({
    id: 2,
    name: "teacher"
  });
 
  Role.create({
    id: 3,
    name: "admin"
  });
}
function createSuperstudysets(){
  Set.create({
    name: "Animals",
    subject: "Język angielski",
    level: "Szkoła podstawowa",
    points: 40
  }).then(data => {
    fiszki.create({
      first_side: "lew",
      second_side: "lion",
      setId: 1//data.id
    }),
    fiszki.create({
      first_side: "słoń",
      second_side: "elephant",
      setId: data.id
    }),
    fiszki.create({
      first_side: "kot",
      second_side: "cat",
      setId: 1//data.id
    }),
    fiszki.create({
      first_side: "pies",
      second_side: "dog",
      setId: 1//data.id
    }),
    fiszki.create({
      first_side: "małpa",
      second_side: "monkey",
      setId: 1//data.id
    }),
    fiszki.create({
      first_side: "orzeł",
      second_side: "eagle",
      setId: 1//data.id
    }),
    fiszki.create({
      first_side: "ptak",
      second_side: "bird",
      setId: 1//data.id
    })
    
  }),
  Set.create({
    name: "Colors",
    subject: "Język angielski",
    level: "Szkoła podstawowa",
    points: 20
  }).then(data=>{
    fiszki.create({
      first_side: "różowy",
      second_side: "pink",
      setId: 2//data.id
    }),
    fiszki.create({
      first_side: "czerwony",
      second_side: "red",
      setId: 2//data.id
    }),
    fiszki.create({
      first_side: "zielony",
      second_side: "green",
      setId: 2//data.id
    }),
    fiszki.create({
      first_side: "fioletowy",
      second_side: "purple",
      setId: 2//data.id
    }),
    fiszki.create({
      first_side: "czarny",
      second_side: "black",
      setId: 2//data.id
    }),
    fiszki.create({
      first_side: "biały",
      second_side: "white",
      setId: 2//data.id
    })
  }),
  Set.create({
    name: "Characters",
    subject: "Język angielski",
    level: "Szkoła podstawowa",
    points: 70
  }).then(data=>{
    fiszki.create({
      first_side: "miły",
      second_side: "nice",
      setId: 3//data.id
    }),
    fiszki.create({
      first_side: "niefrasobliwy",
      second_side: "easy-going",
      setId: 3//data.id
    }),
    fiszki.create({
      first_side: "towarzyski",
      second_side: "out-going",
      setId: 3//data.id
    }),
    fiszki.create({
      first_side: "radosny",
      second_side: "cheerful",
      setId: 3//data.id
    })
  })
}
async function check_date(){
  const class_task = db.class_task;
  console.log(new Date().toLocaleDateString())
  class_task.destroy({where:{ finishDate :  {[Op.lte]:new Date()}}}).then(info=>{
      console.log("usunięto")
  })
}
const job = nodeCron.schedule("00 00 00 * * *", check_date)
check_date()
