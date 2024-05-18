const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Le nom de la matière est requis"],
      unique: [true, "La matière existe déjà"],
      trim: true,
    },
    description: {
      type: String,
      default:
        "Cette matière est une composante essentielle du programme académique. Elle couvre des sujets importants dans ce domaine et fournit aux étudiants les connaissances et les compétences nécessaires pour réussir dans ce domaine d'études. La matière comprend des cours, des devoirs, des évaluations et d'autres activités pédagogiques pour aider les étudiants à acquérir une compréhension approfondie du sujetCette matière est une composante essentielle du programme académique. Elle couvre des sujets importants dans ce domaine et fournit aux étudiants les connaissances et les compétences nécessaires pour réussir dans ce domaine d'études. La matière comprend des cours, des devoirs, des évaluations et d'autres activités pédagogiques pour aider les étudiants à acquérir une compréhension approfondie du sujet",
    },
    academicTerm: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AcademicTerm",
      required: [true, "La période académique est requise"],
    },
    classLevel: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ClassLevel",
        required: [true, "Le niveau de classe est requis"],
      },
    ],
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: [true, "Le professeur est requis"],
    },
    // Ajoutez d'autres champs spécifiques à la matière/cours ici
  },
  {
    timestamps: true, // Ajoute automatiquement des horodatages createdAt et updatedAt
  }
);
// subjectSchema.pre('')
// subjectSchema.pre("save", function (next) {
//   // Formater le nom de la classe
//   if (this.name) {
//     this.name.charAt(0).toUpperCase() + this.name.slice(1).toLowerCase();
//   }
//   next();
// });

const Subject = mongoose.model("Subject", subjectSchema);

module.exports = Subject;
