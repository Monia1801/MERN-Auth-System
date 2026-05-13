const express = require("express");
const mongoose = require("mongoose");
const cors=require("cors");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log("Mongo DB connected successfully");
})
.catch((error) => {
  console.log(error);
});

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

const User = mongoose.model("User", userSchema);

app.post("/login", async (req, res) => {

  try {

    const { email, password } = req.body;
    console.log(email);
    console.log(password);

    const user = await User.findOne({ email });

    if (user) {

      if (password === user.password) {

        res.status(200).json({
          message: "Login Successful"
        });

      }
      else {

        res.status(401).json({
          message: "Invalid email or password"
        });

      }

    }
    else {

      res.status(401).json({
        message: "Invalid email or password"
      });

    }

  }
  catch (error) {

    res.status(500).json({
      message: "Server Error"
    });

  }

});

app.listen(5000, () => {
  console.log("Server running successfully");
});