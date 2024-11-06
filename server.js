require("dotenv").config();
const express = require("express");
const connectDB = require("./src/db/db");

connectDB();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// middleware here

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log("listening on port:", PORT);
});
