const express = require("express");
const subjectProgramController = require("../../controllers/academic/Subject");
const authController = require("../../controllers/staff/authController");

const subjectProgramRouter = express.Router();

subjectProgramRouter.use(authController.protect);

// subjectProgramRouter.use(authController.restrictTo("Teacher"));

// subjectProgramRouter.use(authController.restrictTo("Admin"));
subjectProgramRouter.route("/").post(subjectProgramController.createSubject);
subjectProgramRouter.route("/").get(subjectProgramController.getSubjects);
// Cette route permet d'avoir les cours du professeur connecté
subjectProgramRouter
  .route("/my-courses")
  .get(subjectProgramController.getMyCourses);
subjectProgramRouter
  .route("/my-courses/students")
  .get(subjectProgramController.getMyStudentsCourses);
subjectProgramRouter
  .route("/:id")
  .put(subjectProgramController.updateSubjects)
  .get(subjectProgramController.getSingleSubject);



// subjectProgramRouter.route("/").post(academicProgramController.createProgram);

module.exports = subjectProgramRouter;
