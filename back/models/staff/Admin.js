const mongoose = require("mongoose");
const User = require("./User");
const adminSchema = new mongoose.Schema({});
adminSchema.set("toObject", { virtuals: true }); // Définissez l'option pour inclure les champs virtuels lors de la conversion en objet
adminSchema.set("toJSON", { virtuals: true }); // Définissez l'option pour inclure les champs virtuels lors de la conversion en JSON

// Définissez la valeur par défaut pour le champ "role" comme "admin"
adminSchema.pre("validate", function (next) {
  if (!this.role) {
    this.role = "Admin";
  }
  if (!this.code) {
    this.code =
      "ADM" +
      Math.floor(100 + Math.random() * 900) +
      Date.now().toString().slice(2, 4) +
      this.name
        .split(" ")
        .map((name) => name[0])
        .join("")
        .toUpperCase();
  }
  next();
});

const Admin = User.discriminator("Admin", adminSchema);
module.exports = Admin;
