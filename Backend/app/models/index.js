const config = require("../config/db.config.js");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  config.DB,
  config.USER,
  config.PASSWORD,
  {
    host: config.HOST,
    dialect: config.dialect,
    operatorsAliases: false,
    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle
    }
  }
);
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.images = require("./image.model.js")(sequelize, Sequelize);
db.class_task = require("./class_task.model.js")(sequelize, Sequelize);
db.fiszki = require("./fiszki.model.js")(sequelize, Sequelize);
db.set = require("./set.model.js")(sequelize, Sequelize);
db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.role = require("../models/role.model.js")(sequelize, Sequelize);
db.class = require("../models/class_model.js")(sequelize, Sequelize);
db.final_test = require("../models/final_test-model.js")(sequelize, Sequelize);
db.classList = require("../models/ClassList.model.js")(sequelize, Sequelize);
db.UsersAndsets = require("../models/users&sets.model.js")(sequelize, Sequelize);
db.notification = require("../models/notifications.model.js")(sequelize, Sequelize);
db.role.belongsToMany(db.user, {
  through: "user_roles",
  foreignKey: "roleId",
  otherKey: "userId",
  allowNull: false
});
db.user.belongsToMany(db.role, {
  through: "user_roles",
  foreignKey: "userId",
  otherKey: "roleId",
  allowNull: false
});
db.user.belongsToMany(db.class,{
  through: "students_in_class",
  foreignKey: "studentId",
  otherKey:"classId",
  allowNull: false
 })
 db.class.belongsToMany(db.user,{
  through: "students_in_class",
  foreignKey: "classId",
  otherKey:"studentId",
  allowNull: false
 })
 db.user.hasMany(db.set,{
  foreignKey: "userId",
  allowNull: false
 });
db.set.belongsTo(db.user)
db.user.belongsToMany(db.set,{
  through: "users&sets",
  foreignKey: "studentId",
  otherKey:"setId",
  allowNull: false
 })
 db.set.belongsToMany(db.user,{
  through: "users&sets",
  foreignKey: "setId",
  otherKey:"studentId",
  allowNull: false
 })
db.set.hasMany(db.fiszki,{
  foreignKey: "setId",
  allowNull: false
})

db.fiszki.belongsTo(db.set)
db.class.hasMany(db.set,{
  foreignKey: "classId"
 });
db.set.belongsTo(db.class)
db.user.hasMany(db.class,{
  
  foreignKey:"userId"
  
})
db.class.belongsTo(db.user)

db.set.hasOne(db.final_test,{
  foreignKey:"setId",
  
})
db.final_test.belongsTo(db.set)
db.images.hasOne(db.fiszki, {
  foreignKey:"imageId"
})
db.fiszki.belongsTo(db.images)
db.class.hasMany(db.class_task,{
  foreignKey: 'classId'
})
db.class_task.belongsTo(db.class)
db.ROLES = ["user", "teacher", "admin"];
db.SETS=["Owoce"]
module.exports = db;