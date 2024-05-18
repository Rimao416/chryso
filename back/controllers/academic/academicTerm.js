const AcademicTerm = require("../../models/academic/AcademicTerm");
const catchAsync = require("../../utils/catchAsync");

exports.createAcademicTerm = catchAsync(async (req, res) => {
  let type = "";
  let academicCount = await AcademicTerm.find().countDocuments();
  academicCount === 0 ? (type = "ier") : (type = "ième");
  const academicTermCreated = await AcademicTerm.create({
    name: `${academicCount + 1}${type} Semestre`,
    createdBy: req.user._id,
  });

  // const { name } = req.body;
  // const academicTermCreated = await AcademicTerm.create({
  //   name,
  //   // createdBy: req.userAuth._id,
  // });

  res.status(201).json({
    status: "success",
    message: "Période Académique crée avec succès",
    academicTermCreated,
    // academicTermCreated,
  });
});

exports.getAcademicTerms = catchAsync(async (req, res) => {
  const academicTerms = await AcademicTerm.find();
  res.status(201).json({
    status: "success",
    message: "Academic Terms Fetched Successfully",
    data: academicTerms,
  });
});

exports.getAcademicTerm = catchAsync(async (req, res) => {
  const academicTerm = await AcademicTerm.findById(req.params.id);
  res.status(201).json({
    status: "success",
    message: "Academic Term Fetched Successfully",
    data: academicTerm,
  });
});

exports.updateAcademicTerm = catchAsync(async (req, res) => {
  const { name } = req.body;

  // const updateAcademicTermFound = await AcademicTerm.findOne({ name });
  // if (updateAcademicTermFound) {
  //   throw new Error("Academic Term already exists");
  // }

  const academicTerm = await AcademicTerm.findByIdAndUpdate(
    req.params.id,
    {
      name,
      // createdBy: req.userAuth._id,
    },
    {
      new: true,
    }
  );
  res.status(201).json({
    status: "success",
    message: "Période Académique Mis à Jour avec succès",
    data: academicTerm,
  });
});
