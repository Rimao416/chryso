const catchAsync = require("../../utils/catchAsync");
const Subject = require("../../models/academic/Subject");
const classLevelModel = require("../../models/academic/ClassLevel");
const AppError = require("../../utils/appError");
const User = require("../../models/staff/User");
const ClassLevel = require("../../models/academic/ClassLevel");
exports.createSubject = catchAsync(async (req, res, next) => {
  const { name, academicTerm, classLevel, teacher } = req.body;

  // Vérifier si le sujet existe déjà
  const subjectFound = await Subject.findOne({ name });
  if (!name) {
    next(new AppError("Veuillez remplir le champ du nom", 400, "ErrorName"));
  }
  if (subjectFound) {
    return next(new AppError("Le cours existe déjà", 400));
  }

  // Vérifier si la période académique est fournie
  if (!academicTerm) {
    return next(new AppError("Veuillez entrer la periode académique.", 400));
  }

  if (!teacher) {
    return next(new AppError("Veuillez entrer le enseignant.", 400));
  }

  // Vérifier si au moins une classe est fournie
  if (!classLevel || classLevel.length === 0) {
    return next(new AppError("Veuillez entrer au moins une classe.", 400));
  }

  // Créer le sujet
  const subjectCreated = new Subject({
    name,
    academicTerm,
    classLevel,
    teacher,
  });

  // Sauvegarder le sujet et mettre à jour les classes
  subjectCreated
    .save()
    .then(() => {
      // Pour chaque classe, ajouter la matière
      const updatePromises = classLevel.map((classId) => {
        return classLevelModel.findByIdAndUpdate(
          classId,
          { $push: { subjects: subjectCreated._id } },
          { upsert: true }
        );
      });

      // Attendre que toutes les mises à jour de classes soient terminées
      return Promise.all(updatePromises);
    })
    .then(() => {
      // Tout s'est bien passé, envoyer la réponse
      res.status(201).json({
        status: "success",
        message: "Sujet créé avec succès.",
        subjectCreated,
      });
    })
    .catch((error) => {
      console.error(error);

      // Extraire le message d'erreur spécifique de la validation du modèle
      const validationErrorMessages = Object.values(error.errors).map(
        (err) => err.message
      );

      // Envoyer une réponse avec le message d'erreur extrait
      res.status(400).json({
        status: "error",
        message:
          validationErrorMessages[0] || "Erreur lors de la création du sujet.",
      });
    });
});
exports.getSubjects = catchAsync(async (req, res, next) => {
  const subjects = await Subject.find().populate("classLevel academicTerm");
  res.status(201).json({
    status: "success",
    message: "Sujets fetched successfully",
    data: subjects,
  });
});

exports.updateSubjects = catchAsync(async (req, res, next) => {
  const { name, academicTerm, classLevel, teacher } = req.body;
  const uniqueClassLevel = [...new Set(classLevel)];

  //   Un sujet doit avoir au moins une classe
  if (!name) {
    next(new AppError("Veuillez remplir le champ du nom", 400, "ErrorName"));
  }
  if (!uniqueClassLevel || uniqueClassLevel.length === 0) {
    return next(
      new AppError("Une matière doit avoir au moins une classe", 400)
    );
  }
  if (!academicTerm) {
    return next(new AppError("Veuillez entrer la periode académique.", 400));
  }

  if (!teacher) {
    return next(new AppError("Veuillez entrer le enseignant.", 400));
  }
  const subjectUpdated = await Subject.findByIdAndUpdate(
    req.params.id,
    {
      name,
      academicTerm,
      classLevel: uniqueClassLevel,
      teacher,
    },
    {
      new: true,
    }
  );
  await classLevelModel.updateMany(
    { subjects: req.params.id },
    { $pull: { subjects: req.params.id } }
  );

  await classLevelModel.updateMany(
    { _id: { $in: uniqueClassLevel } },
    { $addToSet: { subjects: req.params.id } }
  );

  res.status(201).json({
    status: "success",
    message: "Sujet modifié avec succès",
    subjectUpdated,
  });
});

exports.getSingleSubject = catchAsync(async (req, res, next) => {
  const subject = await Subject.findById(req.params.id).populate(
    "classLevel academicTerm teacher"
  );
  res.status(201).json({
    status: "success",
    data: subject,
  });
});

// Permet d'avoir la liste des cours de l'enseignant connecté
exports.getMyCourses = catchAsync(async (req, res, next) => {
  // const teacher = await Teacher.findById(req.user._id).populate("course");
  const teacher = await Subject.find({
    teacher: req.user._id,
  }).populate("teacher");
  res.status(200).json({
    status: "success",
    data: teacher,
  });
});
exports.getMyStudentsCourses = catchAsync(async (req, res, next) => {
  const classLevels = await User.find({
    _id: req.user._id,
  }).populate("classLevels").select("classLevels").populate("classLevels subjects")
  console.log(classLevels[0])

  const courses=await ClassLevel.findById("64e7c39ea5d6d199af62e900").populate("subjects")
  
  // console.log(courses)
  res.status(200).json({
    status: "success",
    data: courses,
  });
});
// Informations que nous devons tirer d'un seul cours en vue de statistiques
// 1) Nombre des classes qui suivent ce cours
// 2) Nombre des documents envoyés dans ce cours
// 3) Nombre des absences de ce cours
// MAKE THIS STATISTIC REQUEST

exports.getStatisticGeneralCourse = catchAsync(async (req, res, next) => {
  const subject = await Subject.findById(req.params.id).populate("classLevel");
  res.status(200).json({
    status: "success",
    data: subject,
  });
});
