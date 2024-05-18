const AcademicYear = require("../../models/academic/AcademicYear");
// const Admin = require("../../model/Staff/Admin");
const catchAsync = require("../../utils/catchAsync");
const AppError = require("../../utils/appError");

exports.createAcademicYear = catchAsync(async (req, res, next) => {
  const { fromYear, toYear } = req.body;
  if (fromYear > toYear) {
    return next(
      new AppError("La date de fin doit être superieur à la date de debut", 400)
    );
  }
  const current = req.body.isCurrent ? req.body.isCurrent : false;

  //check if exists
  // const academicYear = await AcademicYear.findOne();
  // if (academicYear) {
  //   throw new Error("Academic year already exists");
  // }
  //use Save
  const academicYearCreated = await AcademicYear.create({
    fromYear,
    toYear,
    isCurrent: current,
  });
  // UPDATE OTHERS ACADEMIC YEAR TO FALSE
  if (current) {
    await AcademicYear.updateMany(
      { _id: { $ne: academicYearCreated._id } },
      { isCurrent: false }
    );
  }

  //
  // A decommenter
  // // console.log(fromYear, toYear);
  // //push academic into admin
  // // const admin = await Admin.findById(req.userAuth._id);
  // // admin.academicYears.push(academicYearCreated._id);
  // // await admin.save();
  res.status(201).json({
    status: "success",
    message: "Année académique crée avec succès",
    academicYearCreated,
  });
});
//@desc  get all Academic Years
//@route GET /api/v1/academic-years
//@acess  Private
exports.getAcademicYears = catchAsync(async (req, res) => {
  const academicYears = await AcademicYear.find();

  res.status(201).json({
    status: "success",
    message: "Années Académiques chargées avec Succès",
    data: academicYears,
  });
});

//@desc  get single Academic Year
//@route GET /api/v1/academic-years/:id
//@acess  Private
exports.getAcademicYear = catchAsync(async (req, res) => {
  const academicYears = await AcademicYear.findById(req.params.id);

  res.status(201).json({
    status: "success",
    message: "Academic years fetched successfully",
    data: academicYears,
  });
});

//@desc   Update  Academic Year
//@route  PUT /api/v1/academic-years/:id
//@acess  Private
exports.updateAcademicYear = catchAsync(async (req, res, next) => {
  const { name, fromYear, toYear,isCurrent } = req.body;
  if (fromYear > toYear) {
    return next(
      new AppError("La date de fin doit être superieur à la date de debut", 400)
    );
  }
  console.log(fromYear)
  const actualYear = fromYear.split("-")[0] + "-" + toYear.split("-")[0];
  console.log(actualYear);

  //check name exists
  const createAcademicYearFound = await AcademicYear.findOne({ name });
  console.log(createAcademicYearFound);
  if (createAcademicYearFound && createAcademicYearFound.name != actualYear) {
    return next(new AppError("L'année académique existe déjà", 400));
  }
  const academicYear = await AcademicYear.findByIdAndUpdate(
    req.params.id,
    {
      name,
      fromYear,
      toYear,
      isCurrent,
    },
    {
      new: true,
    }
  );

  res.status(201).json({
    status: "success",
    message: "Academic years updated successfully",
    data: academicYear,
  });
});

//@desc   Update  Academic Year
//@route  PUT /api/v1/academic-years/:id
//@acess  Private
exports.deleteAcademicYear = catchAsync(async (req, res) => {
  await AcademicYear.findByIdAndDelete(req.params.id);

  res.status(201).json({
    status: "success",
    message: "Academic year deleted successfully",
  });
});
