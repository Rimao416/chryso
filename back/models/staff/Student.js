const mongoose = require("mongoose");
const User = require("./User");
const AcademicYear = require("../academic/AcademicYear");

const studentSchema = new mongoose.Schema({
  classLevels: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ClassLevel",
  },
  academicYear: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AcademicYear",
  },
  dateAdmitted: {
    type: Date,
    default: Date.now,
  },
  program: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Program",
  },
});
studentSchema.set("toObject", { virtuals: true }); // Définissez l'option pour inclure les champs virtuels lors de la conversion en objet
studentSchema.set("toJSON", { virtuals: true }); // Définissez l'option pour inclure les champs virtuels lors de la conversion en JSON

// Définissez la valeur par défaut pour le champ "role" comme "admin"
studentSchema.pre("validate", function (next) {
  if (!this.role) {
    this.role = "Student";
  }
  if (!this.code) {
    this.code =
      "STU" +
      Math.floor(100 + Math.random() * 900) +
      Date.now().toString().slice(2, 4) +
      this.name
        .split(" ")
        .map((name) => name[0])
        .join("")
        .toUpperCase();
  }
  this.password = this.code;
  next();
});

studentSchema.pre("save", async function (next) {
  // Formater le nom de la classe
  try {
    // Trouver l'année académique actuelle
    const currentAcademicYear = await AcademicYear.findOne({ isCurrent: true });

    // Assigner l'année académique actuelle à l'étudiant
    this.academicYear = currentAcademicYear._id;

    next();
  } catch (error) {
    next(error);
  }
});

const Student = User.discriminator("Student", studentSchema);
module.exports = Student;
