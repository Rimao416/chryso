const Program = require("../../models/academic/Program");
const AppError = require("../../utils/appError");
const catchAsync = require("../../utils/catchAsync");

function contientQueDesChiffres(variable) {
  // Utilisation d'une expression régulière pour vérifier si la variable contient uniquement des chiffres
  const regex = /^\d+$/;
  return regex.test(variable);
}
exports.createProgram = catchAsync(async (req, res, next) => {
  // this.duration=this.duration+" ans";
  const { name, duration } = req.body;
  if (!contientQueDesChiffres(duration)) {
    next(new AppError("Veuillez entrer une durée valide", 400, "ErrorName"));
  }
  const finalDuraction = duration + " ans";
  const academicProgramCreated = await Program.create({
    name,
    duration: finalDuraction,
    // createdBy: req.user._id,
  });
  res.status(201).json({
    status: "success",
    message: "Programme Crée avec succès",
    academicProgramCreated,
  });
});
exports.getPrograms = catchAsync(async (req, res, next) => {
  const programs = await Program.find();
  res.status(201).json({
    status: "success",
    message: "Programmes chargés avec succès",
    data: programs,
  });
});
exports.getSingleProgram = catchAsync(async (req, res, next) => {
  const program = await Program.findById(req.params.id);
  res.status(201).json({
    status: "success",
    data: program,
  });
});

exports.updateProgram = catchAsync(async (req, res, next) => {
  // const { name, duration } = req.body;
  
  const updatedProgram = await Program.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.status(201).json({
    status: "success",
    data: updatedProgram,
  });
});
