const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Le Nom est obligatoire"],
    },
    lastname: {
      type: String,
      required: [true, "Le Prénom est obligatoire"],
    },
    email: {
      type: String,
      required: [true, "L'Email est obligatoire"],
      unique: [true, "L'Email est déjà utilisé"],
      validate: {
        validator: function (value) {
          return validator.isEmail(value);
        },
        message: "Entrez une adresse mail valide",
      },
    },
    adresse: {
      type: String,
      // required: [true, "L'adresse est obligatoire"],
    },
    password: {
      type: String,
      required: [true, "Le mot de passe est obligatoire"],
      minlength: [8, "Le mot de passe doit contenir au moins 8 caractères"],
      select: false,
    },
    passwordConfirm: {
      type: String,
      default: undefined,
    },
    birthday: {
      type: Date,
    },
    code: {
      type: String,
    },
    sexe: {
      type: String,
      required: [true, "Le sexe est obligatoire"],
      enum: { values: ["Femme", "Homme"], message: "Entrez un sexe valide" },
    },
    photo: {
      type: String,
      default: "default.png",
    },
    phoneNumber: {
      type: String,
    },
    status: {
      type: String,
      enum: ["Bloqué", "Confirmé", "Confinement"],
      default: "Confirmé",
    },
    role: { type: String, required: true },

    passwordChangeAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    discriminatorKey: "role",
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified("password")) return next();

  // Hash the password with cost of 12
  this.email = this.email.toLowerCase();
  this.name = normalizeName(this.name);
  this.lastName = normalizeName(this.lastName);
  this.password = await bcrypt.hash(this.password, 12);
  next();
});
function normalizeName(name) {
  if (typeof name !== "string") {
    return name;
  }
  // Met la première lettre en majuscule et le reste en minuscules
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  const myPass = await bcrypt.compare(candidatePassword, userPassword);
  return myPass;
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangeAt) {
    // YOUR RETURN VALUE
    const changedTimestamp = parseInt(
      this.passwordChangeAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }

  return false;
};

userSchema.methods.isValidEmail = function (email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  console.log({ resetToken }, this.passwordResetToken);
  // this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

userSchema.methods.saveWithPasswordConfirmValidation = async function () {
  return (
    this.passwordConfirm.trim().length >= 1 &&
    this.passwordConfirm &&
    this.passwordConfirm === this.password
  );
};

//model
const User = mongoose.model("User", userSchema);

module.exports = User;
