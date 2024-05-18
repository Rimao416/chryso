const crypto = require("crypto");
const { promisify } = require("util");

const jwt = require("jsonwebtoken");

// const sendEmail = require("./../utils/email");
const createSendToken = require("../../utils/createSendToken");
const User = require("../../models/staff/User");
const catchAsync = require("../../utils/catchAsync");
const AppError = require("../../utils/appError");
const sendEmail = require("../../utils/email");

exports.login = catchAsync(async (req, res, next) => {
  const { identifier, password } = req.body;
  // 1) Vérifier si l'email et mot de passe existe
  if (!identifier) {
    next(
      new AppError(
        "Veuillez remplir le champ du mail/code",
        400,
        "ErrorIdentifier"
      )
    );
  }
  if (!password) {
    next(new AppError("Veuillez remplir le mot passe", 400, "ErrorPassword"));
  }

  // 2) Vérifie si l'utilisateur existe ou le mot de passe est correcte
  const user = await User.findOne({
    $or: [{ email: identifier }, { code: identifier }],
  }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Mail/code ou Mot de passe incorrect", 401));
  }
  // // 3) Si tout est correcte, envoie le token
  createSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Obtenir le token et voir si il existe
  let token;
  console.log(req.cookies)
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
    
  }

  if (!token) {
    return next(new AppError("Vous n'etes pas connecté, connectez vous"));
  }
  // 2) Verification du token

  let decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // 3) Vérifier si l'utilisateur existe
  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    return next(new AppError("Le token de cet utilisateur n'existe plus"));
  }

  // 4) Vérifier si le mot de passe a changé après la création du token

  // if (freshUser.changedPasswordAfter(decoded.iat)) {
  //   return next(
  //     new AppError("L'utilisateur a recemment changé son mot de passe"),
  //     401
  //   );
  // }
  req.user = freshUser;
  next();
});
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError("You are not allow to execute this", 403));
    }
    next();
  };
};
exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      // 1) verify token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      // 2) Check if user still exists
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }

      // 3) Check if user changed password after the token was issued
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }

      // THERE IS A LOGGED IN USER
      res.locals.user = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};

exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      // 1) verify token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      // 2) Check if user still exists
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }

      // 3) Check if user changed password after the token was issued
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }

      // THERE IS A LOGGED IN USER
      res.locals.user = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const { identifier } = req.body;
  // 1) Get USER BASED ON POSTED EMAIL
  const user = await User.findOne({
    $or: [{ email: identifier }, { code: identifier }],
  });
  if (!user) {
    return next(
      new AppError("Aucun utilisateur trouvé avec cet identifiant", 404)
    );
  }

  // // 2) GENERATE THE RANDOM RESET TOKEN
  const resetToken = user.createPasswordResetToken();
  console.log(resetToken);
  await user.save({ validateBeforeSave: false });
  // // 3)Envoyer à l'utilisateur
  const resetURL = `http://localhost:5173/reset-password/${resetToken}`;
  // const message = `Mot de passe oublié ? Confirmez votre identité ici ${resetURL}.\n Si vous n'etes pas l'utilisateur, ignorez ce mail.`;
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
          <h1>Mot de passe oublié</h1>
      </div>
      
    <h3>Cher utilisateur</h3>
    <pre></pre>
    <p>Nous avons reçu une demande de réinitialisation de mot de passe pour votre compte. Si vous n'avez pas effectué cette demande, veuillez ignorer cet e-mail</p> 
    
    <a href=${resetURL}>${resetURL}Cliquez moi</a>
    
  </div>
</body>
<footer>
     <p>Votre confidentialité est importante pour nous. Nous vous rappelons de traiter vos coordonnées avec la plus grande confidentialité. Ne partagez pas vos informations personnelles avec des personnes non autorisées et veillez à utiliser des méthodes sécurisées pour communiquer avec nous. En cas de doute, n'hésitez pas à nous contacter pour plus d'informations sur la manière dont nous protégeons vos données.</p>
     
     <p>Cordialement, l'Equipe Alumi</p>

</footer>
</html>`;
  try {
    await sendEmail({
      email: user.email,
      subject: "Mot de passe oublié",
      message,
    });
    res.status(200).json({
      status: "success",
      message:
        "Un lien de réinitialisation de mot de passe a été envoyé à votre adresse e-mail. Veuillez vérifier votre boîte de réception et suivre les instructions pour réinitialiser votre mot de passe. Si vous ne trouvez pas le message dans votre boîte de réception, veuillez vérifier le dossier de courrier indésirable",
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new AppError("Erreur lors de l'envoie du mail"), 500);
  }
});
exports.resetPassword = catchAsync(async (req, res, next) => {
  console.log(req.body);
  // console.log(req.params.token);
  // 1) Get User based on the token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  // console.log(hashedToken)
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  }).select("+password");
  console.log(user)
  // 2) Si le token n'a pas expiré et qu'il y'a un utilisateur, définit un mot de passe
  if (!user) {
    return next(new AppError("Token Invalide ou a expiré", 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  if (!(await user.saveWithPasswordConfirmValidation())) {
    return next(
      new AppError(
        "Les champs de mot de passe et de confirmation du mot de passe doivent être remplis et les mêmes. Veuillez vérifier",
        400
      )
    );
  }

  // user.passwordResetToken = undefined;
  // user.passwordResetExpires = undefined;
  await user.save();
  // 3) Modifier l'attribut changedPasswordAt pour l'utilisateur

  // 4) Connectez l'utilisateur, l'envoie d'un JWT code
  createSendToken(user, 200, res);
});
exports.checkTokenValidity = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(new AppError("Token Invalide ou a expiré", 400));
  }
  res.status(200).json({
    status: "success",
    message: "Token Valide",
  });
});
exports.updatePassword = catchAsync(async (req, res, next) => {
  // console.log(res);
  // 1) Get the user from the Collection
  const user = await User.findById(req.user.id).select("+password");
  console.log(user);
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError("You're actually password is Wrong ", 401));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  console.log(req.user);
  await user.save();
  // 2) Check if POSTED Current Password is Correct
  // 3) If So, Update the password
  // 4) Log User In, Send Jwt
  // console.log("You can't live with your own failure");
  createSendToken(user, 200, res);
});
