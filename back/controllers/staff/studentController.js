const Student = require("../../models/staff/Student");

const catchAsync = require("../../utils/catchAsync");
const AppError = require("../../utils/appError");
const classLevelModel = require("../../models/academic/ClassLevel");
const multer = require("multer");
const sharp = require("sharp");
const sendEmail = require("../../utils/email");

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadUserPhoto = upload.single("photo");
exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();
  // console.log(req.file)

  req.file.filename = `user-${Date.now()}.jpeg`;
  req.body.photo = req.file.filename;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
});

exports.createStudent = catchAsync(async (req, res, next) => {
  //   console.log(req.body);
  const createStudent = await Student.create(req.body);
  // check if student email exist and return error
  // if(await Student.findOne({email:req.body.email})){
  //   return next(new AppError("Cette adresse mail existe déjà", 400))
  // }
  res.status(200).json({
    status: "success",
    message: "Etudiant ajouté avec succès",
    createStudent,
  });
  // const student = await Student.create(req.body);
  // res.status(201).json({
  //     status: "success",
  //     data: {
  //         student,
  //     },
  // });
});
exports.getAllStudent = catchAsync(async (req, res, next) => {
  const student = await Student.find();
  res.status(200).json({
    status: "success",
    data: student,
  });
});

exports.getSingleStudent = catchAsync(async (req, res, next) => {
  const student = await Student.findById(req.params.id);
  res.status(200).json({
    status: "success",
    data: student,
  });
});

exports.updateStudent = catchAsync(async (req, res, next) => {
  const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: false,
  });
  res.status(200).json({
    status: "success",
    data: {
      student,
    },
  });
});

exports.archiveStudent = catchAsync(async (req, res, next) => {
  const student = await Student.findByIdAndUpdate(req.params.id, {
    status: "Bloqué",
  });
  res.status(200).json({
    status: "success",
    data: {
      student,
    },
  });
});
