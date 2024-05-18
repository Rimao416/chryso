const ClassLevel = require("../../models/academic/ClassLevel");
const AppError = require("../../utils/appError");
const catchAsync = require("../../utils/catchAsync");
const classAuthorize = ["Licence", "Master", "Doctorat"];
exports.createClassLevel = catchAsync(async (req, res, next) => {
  const { name } = req.body;
  console.log(name);
  const classLevel = await ClassLevel.find({
    name: {
      $regex: name,
      $options: "i",
    },
  }).countDocuments();

  const classCreated = await ClassLevel.create({
    name: name + " " + (classLevel + 1),
    createdBy: req.user._id,
  });
  res.status(201).json({
    status: "success",
    message: "Niveau Crée avec succès",
    classCreated,
  });
});

exports.getClassLevels = catchAsync(async (req, res, next) => {
  const classLevels = await ClassLevel.find().populate("subjects");
  res.status(201).json({
    status: "success",
    data: classLevels,
  });
});

exports.updateClassLevels = catchAsync(async (req, res, next) => {
  const { name } = req.body;

  const { id } = req.params;
  // CHECK IF ID EXIST
  if (!name) {
    next(new AppError("Veuillez remplir le champ du nom", 400, "ErrorName"));
  }
  const nameSlice = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  const classLevel = await ClassLevel.findByIdAndUpdate(
    id,
    { name: nameSlice },
    { new: true }
  );
  res.status(201).json({
    status: "success",
    data: classLevel,
  });
});
exports.getSingleClassLevel = catchAsync(async (req, res, next) => {
  const classLevel = await ClassLevel.findById(req.params.id);
  res.status(201).json({
    status: "success",
    data: classLevel,
  });
});
