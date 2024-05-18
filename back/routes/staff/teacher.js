const express = require("express");
const multer = require("multer");
const {
  registerTeacher,
  getAllTeacher,
  uploadUserPhoto,
  resizeUserPhoto,
  getSingleTeacher,
  getMyCourses,
} = require("../../controllers/staff/teacherController");
const authController = require("../../controllers/staff/authController");

const teacherRouter = express.Router();

teacherRouter.use(authController.protect);


// Actions requises pour le professeur


// Actions requises pour l'administrateur
teacherRouter.use(authController.restrictTo("Admin"));

teacherRouter.post(
  "/register",
  uploadUserPhoto,
  resizeUserPhoto,
  registerTeacher
);
teacherRouter.route("/").get(getAllTeacher);
teacherRouter.route("/:id").get(getSingleTeacher);
module.exports = teacherRouter;
