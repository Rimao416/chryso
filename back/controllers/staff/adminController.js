const bcrypt = require("bcryptjs");
const Admin = require("../../models/staff/Admin");
const catchAsync = require("../../utils/catchAsync");
const jwt = require("jsonwebtoken");
const AppError = require("../../utils/appError");
const createSendToken = require("../../utils/createSendToken");
// const generateToken = require("../../utils/generateToken");
// const verifyToken = require("../../utils/verifyToken");
// const { hashPassword, isPassMatched } = require("../../utils/helpers");
// const catchAsync=require("./../../utils/appError")


//@desc Register admin
//@route POST /api/admins/register
//@acess  Private
// exports.registerAdmin = AysncHandler(async (req, res) => {
//   const { name, email, password } = req.body;
//   //Check if email exists
//   const adminFound = await Admin.findOne({ email });
//   if (adminFound) {
//     throw new Error("Admin Exists");
//   }

//   //register
//   const user = await Admin.create({
//     name,
//     email,
//     password: await hashPassword(password),
//   });
//   res.status(201).json({
//     status: "success",
//     data: user,
//     message: "Admin registered successfully",
//   });
// });
exports.registerAdmin=catchAsync(async(req,res,next)=>{
    const {name,lastname,email,password,sexe}=req.body
    // Check if email exists
   
    const createAdmin=await Admin.create({
        name,
        lastname,
        email,
        password,
        sexe
    })
    createSendToken(createAdmin,201,res)
    // res.status(200).json({
    //     status:"success",
    //     message:"Admin registered successfully"
    // })
})


exports.loginAdmin = catchAsync(async (req, res, next) => {
  const { identifier, password } = req.body;
  // 1) Vérifier si l'email et mot de passe existe
  if(!identifier){
    next(new AppError("Veuillez remplir le champ du mail/code",400,"ErrorIdentifier"));
  }
  if(!password){
    next(new AppError("Veuillez remplir le mot passe",400,"ErrorPassword"));
  }
  

  // 2) Vérifie si l'utilisateur existe ou le mot de passe est correcte
  const user = await Admin.findOne({
    $or: [{ email: identifier }, { code: identifier }],
  }).select("+password");
  console.log(user)
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Mail/code ou Mot de passe incorrect", 401));
  }else{
    console.log("Welcome")
  }
  // // 3) Si tout est correcte, envoie le token
  createSendToken(user, 200, res);
});

// exports.registerAdmin=catch
//@desc     login admins
//@route    POST /api/v1/admins/login
//@access   Private
// exports.loginAdminCtrl = AysncHandler(async (req, res) => {
//   const { email, password } = req.body;
//   //find user
//   const user = await Admin.findOne({ email });
//   if (!user) {
//     return res.json({ message: "Invalid login crendentials" });
//   }
//   //verify password
//   const isMatched = await isPassMatched(password, user.password);

//   if (!isMatched) {
//     return res.json({ message: "Invalid login crendentials" });
//   } else {
//     return res.json({
//       data: generateToken(user._id),
//       message: "Admin logged in successfully",
//     });
//   }
// });

//@desc     Get all admins
//@route    GET /api/v1/admins
//@access   Private

// exports.getAdminsCtrl = AysncHandler(async (req, res) => {
//   const admins = await Admin.find();
//   res.status(200).json({
//     status: "success",
//     message: "Admin fetched successfully",
//     data: admins,
//   });
// });
//@desc     Get single admin
//@route    GET /api/v1/admins/:id
//@access   Private

// exports.getAdminProfileCtrl = AysncHandler(async (req, res) => {
//   const admin = await Admin.findById(req.userAuth._id)
//     .select("-password -createdAt -updatedAt")
//     .populate("academicYears");
//   if (!admin) {
//     throw new Error("Admin Not Found");
//   } else {
//     res.status(200).json({
//       status: "success",
//       data: admin,
//       message: "Admin Profile fetched  successfully",
//     });
//   }
// });

//@desc    update admin
//@route    UPDATE /api/v1/admins/:id
//@access   Private
// exports.updateAdminCtrl = AysncHandler(async (req, res) => {
//   const { email, name, password } = req.body;
//   //if email is taken
//   const emailExist = await Admin.findOne({ email });
//   if (emailExist) {
//     throw new Error("This email is taken/exist");
//   }

//   //hash password
//   //check if user is updating password

//   if (password) {
//     //update
//     const admin = await Admin.findByIdAndUpdate(
//       req.userAuth._id,
//       {
//         email,
//         password: await hashPassword(password),
//         name,
//       },
//       {
//         new: true,
//         runValidators: true,
//       }
//     );
//     res.status(200).json({
//       status: "success",
//       data: admin,
//       message: "Admin updated successfully",
//     });
//   } else {
//     //update
//     const admin = await Admin.findByIdAndUpdate(
//       req.userAuth._id,
//       {
//         email,
//         name,
//       },
//       {
//         new: true,
//         runValidators: true,
//       }
//     );
//     res.status(200).json({
//       status: "success",
//       data: admin,
//       message: "Admin updated successfully",
//     });
//   }
// });

//@desc     Delete admin
//@route    DELETE /api/v1/admins/:id
//@access   Private
// exports.deleteAdminCtrl = (req, res) => {
//   try {
//     res.status(201).json({
//       status: "success",
//       data: "delete admin",
//     });
//   } catch (error) {
//     res.json({
//       status: "failed",
//       error: error.message,
//     });
//   }
// };

