const express = require("express");
const classLevelController = require("../../controllers/academic/classLevel");
const authController = require("../../controllers/staff/authController");
const classLevelRouter = express.Router();

classLevelRouter.use(authController.protect);
classLevelRouter.use(authController.restrictTo("Admin"));
classLevelRouter
  .route("/")
  .post(classLevelController.createClassLevel)
  .get(classLevelController.getClassLevels);
classLevelRouter
  .route("/:id")
  .put(classLevelController.updateClassLevels)
  .get(classLevelController.getSingleClassLevel);

module.exports = classLevelRouter;
