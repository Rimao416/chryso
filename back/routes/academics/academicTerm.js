const express = require("express");
const academicTermController = require("../../controllers/academic/academicTerm");
const authController = require("../../controllers/staff/authController");

const academicTermRouter = express.Router();

academicTermRouter.use(authController.protect);
academicTermRouter.use(authController.restrictTo("Admin"));
academicTermRouter
  .route("/")
  .get(academicTermController.getAcademicTerms)
  .post(academicTermController.createAcademicTerm);

academicTermRouter
  .route("/:id")
  .get(academicTermController.getAcademicTerm)
  .put(academicTermController.updateAcademicTerm);

module.exports = academicTermRouter;
