const express = require("express"); //Faire appel au Package d'expressJs
const morgan = require("morgan");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const userRouter=require("./routes/staff/user");
// const academicYearRouter = require("./routes/academics/academicYear");
const adminRouter = require("./routes/staff/admin");
const academicYearRouter = require("./routes/academics/academicYear");
const academicTermRouter=require("./routes/academics/academicTerm")
const classLevelRouter=require("./routes/academics/classLevel")
const studentRouter=require("./routes/staff/student");
const subjectRouter=require("./routes/academics/subject")
const programRouter=require('./routes/academics/academicProgram')
const paymentRouter=require('./routes/academics/payments')
const cors = require("cors");
const cookieParser=require("cookie-parser")
const teacherRouter = require("./routes/staff/teacher");
const app = express();

const allowedOrigins = ["http://localhost:5173"];
// app.use(cors({
//   origin: (origin, callback) => {
//     if (allowedOrigins.includes(origin) || !origin) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   }
// }));


// 1) MIDDLEWARE
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());
app.use(cookieParser())
// app.use(cors({
//   origin: '*',
//   credentials: true
// }));
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5176", "https://r.stripe.com/b", "https://stripe.com", "https://r.stripe.com"],
  credentials: true
}));
app.use(express.static(`${__dirname}/public`));

// app.use((req, res, next) => {
//   // req.requestTime = new Date();
//   // console.log(req.cookies)
//   // console.log(req.cookies)
//   next();
// });

// 2) ROUTE HANDLERS

// 3) ROUTES

// app.use((req, res, next) => {
//   console.log("Hello from middleware");
//   next();
// });

// app.use("/api/v1/users", userRouter);


app.use("/api/v1/admins", adminRouter);
app.use("/api/v1/admin/teachers",teacherRouter)
app.use('/api/v1/admin/students',studentRouter)
app.use('/api/v1/users',userRouter)
app.use('/api/v1/academic-years',academicYearRouter)
app.use('/api/v1/academic-terms',academicTermRouter)
app.use('/api/v1/class-levels',classLevelRouter)
app.use('/api/v1/academic-programs',programRouter)
app.use('/api/v1/academic-payments',paymentRouter)
app.use('/api/v1/academic-subjects',subjectRouter)

// ROUTES SPECIFIQUES AU PROFESSEUR
app.use("/api/v1/teacher", teacherRouter);


// app.use("/api/v1/academic-years", academicYearRouter);

// Handle Errors

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

// 4) SERVER

module.exports = app;
