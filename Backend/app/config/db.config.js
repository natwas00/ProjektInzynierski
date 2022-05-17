module.exports = {
    HOST: "localhost",
    USER: "root",
    PASSWORD: "",
    DB: "example",
    dialect: "mysql",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };
// module.exports = {
//     HOST: "mysql.wmi.amu.edu.pl",
//     USER: "s452743_proj",
//     PASSWORD: "ingstanitchanta",
//     DB: "s452743_proj",
//     dialect: "mysql",
//     pool: {
//       max: 5,
//       min: 0,
//       acquire: 30000,
//       idle: 10000
//     }
//   };