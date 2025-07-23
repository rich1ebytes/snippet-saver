const express = require("express");
const app = express();

const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const methodOverride = require("method-override");

require("dotenv").config();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(methodOverride("_method")); 

app.get("/", (req, res) => {
  res.render("index");
});

const loginRoute = require("./routes/login");
app.use("/", loginRoute);

const signupRoute = require("./routes/signup");
app.use("/", signupRoute);

const profileRoutes = require("./routes/profile");
app.use("/",profileRoutes);

app.get("/logout", (req, res) => {
  res.cookie("token", "");
  res.redirect("login");
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
 //Server starts after DB connection
    app.listen(3000, () => {
      console.log("Server: http://localhost:3000");
    });
  })

