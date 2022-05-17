const { authJwt, verifySet } = require("../middleware");
const set_controller = require("../controllers/set.controller");
module.exports = function(app) {
    app.use(function(req, res, next) {
      res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
      );
      next();
    });
    app.get(
        "/set/:id",
        [authJwt.verifyToken],
        set_controller.findOneSet
      );
      app.post("/api/add_set/:id",
      [authJwt.verifyToken, verifySet.check_set],set_controller.add_to_exsist_set)
      app.get("/api/sets",
      [authJwt.verifyToken],set_controller.all_sets)
      app.post("/api/add_set",
      [authJwt.verifyToken, verifySet.check_create_set],set_controller.create_set)

      app.delete("/api/deleteCard/:id",
      [authJwt.verifyToken, verifySet.check_delete_card],set_controller.deletecards)

      app.delete("/api/deleteset/:id",
      [authJwt.verifyToken, verifySet.check_delete_set],set_controller.deleteset)
      
}