const mongoose = require("mongoose");

const { Schema } = mongoose;

const ProgramSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Le nom du programme est obligatoire"],
      unique: [true, "Le programme académique doit être unique"],
    },
    duration: {
      type: String,
      required: [true, "La durée du programme académique est réquise"],
    },
    // created automatically
    //CSFTY
    code: {
      type: String,
      default: function () {
        return (
          this.name
            .split(" ")
            .map((name) => name[0])
            .join("")
            .toUpperCase() +
          Math.floor(10 + Math.random() * 90) +
          Math.floor(10 + Math.random() * 90)
        );
      },
    },
    // createdBy: {
    //   type: Schema.Types.ObjectId,
    //   ref: "Admin",
    //   required: true,
    // },
    //we will push the teachers that are in charge of the program
    teachers: [
      {
        type: Schema.Types.ObjectId,
        ref: "Teacher",
      },
    ],
    students: [
      {
        type: Schema.Types.ObjectId,
        ref: "Student",
        default: [],
      },
    ],
    //we will push the subjects that are in the program when the program is created
    subjects: [
      {
        type: Schema.Types.ObjectId,
        ref: "Subject",
        default: [],
      },
    ],
  },
  { timestamps: true }
);
// ProgramSchema.pre("save",function(next){
//   this.duration=this.duration+" ans";
//   next();
// })

const Program = mongoose.model("Program", ProgramSchema);

module.exports = Program;
