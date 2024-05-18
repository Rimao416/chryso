const mongoose = require("mongoose");

const { Schema } = mongoose;

const academicTermSchema = new Schema(
  {
    name: {
      type: String,
      unique: [true, "La période académique existe déjà"],
    },
    duration: {
      type: String,
      required: true,
      default: "6 mois",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
  },
  { timestamps: true }
);

const AcademicTerm = mongoose.model("AcademicTerm", academicTermSchema);
module.exports = AcademicTerm;
