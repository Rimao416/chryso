const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./index");
dotenv.config({ path: "./config.env" });
process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION");
  process.exit(1);
});

// console.log(process.env)

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);
mongoose.set("strictQuery", true);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((con) => {
    // console.log(con.connections);
    // console.log(con);
    console.log("Connexion réussie");
  });

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  // process.exit(1)
  server.close(() => {
    process.exit(1);
  });
});
// console.log(x);
