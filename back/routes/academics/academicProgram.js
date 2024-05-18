const express = require("express");
const academicProgramController = require("../../controllers/academic/program");
const authController = require("../../controllers/staff/authController");

const academicProgramRouter = express.Router();

academicProgramRouter.use(authController.protect);
academicProgramRouter.use(authController.restrictTo("Admin"));
academicProgramRouter
  .route("/")
  .get(academicProgramController.getPrograms)
  .post(academicProgramController.createProgram);

academicProgramRouter
  .route("/:id")

  .get(academicProgramController.getSingleProgram)
  .put(academicProgramController.updateProgram);

module.exports = academicProgramRouter;
