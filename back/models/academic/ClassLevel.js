const mongoose = require("mongoose");

const { Schema } = mongoose;
const validClassLevelNames = ["licence", "master", "doctorat"];
const ClassLevelSchema = new Schema(
  {
    //level100/200/300/400
    name: {
      type: String,
      required: true,
      trim: true,
      unique: [true, "Le niveau existe déjà"],
      validate: {
        validator: function (value) {
          return validClassLevelNames.some((term) =>
            value.toLowerCase().includes(term)
          );
        },
        message: (props) => `${props.value} n'est pas un nom de classe valide`,
      },
    },
    // createdBy: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Admin",
    //   required: true,
    // },
    //students will be added to the class level when they are registered
    students: [
      {
        type: Schema.Types.ObjectId,
        ref: "Student",
      },
    ],
    //optional.
    subjects: [
      {
        type: Schema.Types.ObjectId,
        ref: "Subject",
      },
    ],
    teachers: [
      {
        type: Schema.Types.ObjectId,
        ref: "Teacher",
      },
    ],
  },
  { timestamps: true }
);

ClassLevelSchema.pre("save", function (next) {
  // Formater le nom de la classe
  this.name =
    this.name.charAt(0).toUpperCase() + this.name.slice(1).toLowerCase();
  next();
});

const ClassLevel = mongoose.model("ClassLevel", ClassLevelSchema);

module.exports = ClassLevel;
