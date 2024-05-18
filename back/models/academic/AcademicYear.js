const mongoose = require("mongoose");

const academicYearSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: [true, "Cette année académique existe déjà"],
    },
    fromYear: {
      type: Date,
      required: [true, "Entrez le premier jour de l'année académique"],
    },
    toYear: {
      type: Date,
      required: [true, "Entrez le dernier jour de l'année académique"],
    },
    isCurrent: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      // required: true,
    },
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
      },
    ],
    teachers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Teacher",
      },
    ],
    //Finance
    //Librarian
    //......
  },
  {
    timestamps: true,
  }
);
academicYearSchema.pre("save", function (next) {
  const fromYear = this.fromYear.getFullYear();
  const toYear = this.toYear.getFullYear();
  this.name = `${fromYear}-${toYear}`;
  next()
});

//model
const AcademicYear = mongoose.model("AcademicYear", academicYearSchema);

module.exports = AcademicYear;
