const express=require("express")
const multer=require("multer")
const {createStudent,
uploadUserPhoto,resizeUserPhoto,getAllStudent,getSingleStudent,
updateStudent,
archiveStudent}=require("../../controllers/staff/studentController")
const studentRouter=express.Router()
const authController = require("../../controllers/staff/authController");


studentRouter.use(authController.protect);
studentRouter.use(authController.restrictTo("Admin"));

studentRouter.post("/register", uploadUserPhoto,
resizeUserPhoto,
createStudent
);
studentRouter.route("/").get(getAllStudent);
studentRouter.route("/:id").get(getSingleStudent).put(uploadUserPhoto,resizeUserPhoto,updateStudent)

studentRouter.route("/archive/:id").put(archiveStudent)
module.exports=studentRouter