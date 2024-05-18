const express = require("express");
const acadedemicYearController = require("../../controllers/academic/academicYear");
const authController = require("../../controllers/staff/authController");

// const {
//   createAcademicYear,
//   getAcademicYears,
//   getAcademicYear,
//   updateAcademicYear,
//   deleteAcademicYear,
// } = require("../../controllers/academic/academicYear");
// const isAdmin = require("../../middlewares/isAdmin");
// const isLogin = require("../../middlewares/isLogin");

const academicYearRouter = express.Router();


academicYearRouter.use(authController.protect)
academicYearRouter.use(authController.restrictTo("Admin"))
academicYearRouter
  .route("/")
  .post(acadedemicYearController.createAcademicYear)
  .get(acadedemicYearController.getAcademicYears);
academicYearRouter
  .route("/:id")
  .get(acadedemicYearController.getAcademicYear)
  .put(acadedemicYearController.updateAcademicYear)
  .delete(acadedemicYearController.deleteAcademicYear);
// academicYearRouter
//   .route("/")
//   .post(isLogin, isAdmin, createAcademicYear)
//   .get(isLogin, isAdmin, getAcademicYears);
// academicYearRouter
//   .route("/:id")
//   .get(isLogin, isAdmin, getAcademicYear)
//   .put(isLogin,isAdmin,updateAcademicYear)
//   .delete(isLogin, isAdmin, deleteAcademicYear);
module.exports = academicYearRouter;
