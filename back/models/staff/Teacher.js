const mongoose = require("mongoose");
const User = require("./User");
const teacherSchema = new mongoose.Schema({});
teacherSchema.set("toObject", { virtuals: true }); // Définissez l'option pour inclure les champs virtuels lors de la conversion en objet
teacherSchema.set("toJSON", { virtuals: true }); // Définissez l'option pour inclure les champs virtuels lors de la conversion en JSON

// Définissez la valeur par défaut pour le champ "role" comme "admin"
teacherSchema.pre("validate", function (next) {
  if (!this.role) {
    this.role = "Teacher";
  }
  if (!this.code) {
    this.code =
      "TEA" +
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

const Teacher = User.discriminator("Teacher", teacherSchema);
module.exports = Teacher;
