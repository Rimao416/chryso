const Teacher = require("../../models/staff/Teacher");
const AppError = require("../../utils/appError");
const catchAsync = require("../../utils/catchAsync");

const createSendToken = require("../../utils/createSendToken");
const multer = require("multer");
const sharp = require("sharp");
const sendEmail = require("../../utils/email");

// MULTER CONFIGURATION
// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/img/users');
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split('/')[1];
//     cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//   }
// });
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

exports.registerTeacher = catchAsync(async (req, res, next) => {
  // console.log(req.file, req.body);
  // const { name, lastname, email, sexe } = req.body;
  // console.log(req.file.path);
  // Check if email exists

  const createTeacher = await Teacher.create(req.body);

  const message = `<html lang="en">
  <head>
  <link href="https://fonts.googleapis.com/css2?family=Gantari:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800&display=swap" rel="stylesheet">
    <style>
    body {
      font-family: 'Gantari', sans-serif; /* Remplacez 'Arial' par la police de votre choix */
      background-color:rgb(247,247,245);
    }
    .container {
        background-color:white;
        padding:3rem;
      /* Ajoutez d'autres styles au besoin */
    }
    .credentials{
        margin-top:1rem;
    }
    .bold{
        font-weight:bold;
    }
    footer{
        padding:3rem;
        font-size:12px;
        text-align:center;
    }
    .header{
      background-color:rgb(15,23,42);
      padding:.5rem;
      color:white;
  }
      /* Ajoutez d'autres styles au besoin */
    </style>
  </head>
  <body>
  <div class="container">
  <div class="header">
            <h1>Informations du compte</h1>
        </div>
<h3>Cher Professeur(e)</h3>
<pre></pre>
<p>Voici les informations de votre compte</p> 
<div class="credentials">
    
  Nom: <span class="bold"> ${createTeacher.name} ${createTeacher.lastname}
  </span>
</div>
<div class="credentials">
    
   Email: ${createTeacher.email} / Code de connexion : ${createTeacher.code}
</div>
 <div class="credentials">
          Mot de passe: ${createTeacher.code}
</div>
</div>
  </body>
  <footer>
  <p>Votre confidentialité est importante pour nous. Nous vous rappelons de traiter vos coordonnées avec la plus grande confidentialité. Ne partagez pas vos informations personnelles avec des personnes non autorisées et veillez à utiliser des méthodes sécurisées pour communiquer avec nous. En cas de doute, n'hésitez pas à nous contacter pour plus d'informations sur la manière dont nous protégeons vos données.</p>
  
  <p>Cordialement, l'Equipe Alumi</p>

</footer>
</html>`;
  try {
    await sendEmail({
      email: req.body.email,
      subject: "Activation du compte",
      message,
    });
    res.status(200).json({
      status: "success",
      message: "Professeur(e) ajouté(e) avec succès",
      createTeacher,
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      alert: [{ field: "Email", message: "Erreur lors de l'envoie du mail" }],
    });
  }

  console.log("Ajouté avec succes");

  // createSendToken(createTeacher,201,res)
});

exports.getAllTeacher = catchAsync(async (req, res, next) => {
  const teacher = await Teacher.find();
  res.status(200).json({
    status: "success",
    data: teacher,
  });
});

exports.getSingleTeacher = catchAsync(async (req, res, next) => {
  const teacher = await Teacher.findById(req.params.id);
  res.status(200).json({
    status: "success",
    data: teacher,
  });
});

// Permet au prof connecté d'avoir accès à ses cours

