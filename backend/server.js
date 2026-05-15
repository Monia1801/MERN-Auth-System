const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || "https://mern-auth-frontend-n0ab.onrender.com",
  credentials: true,
}));
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

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access denied" });
  }

  jwt.verify(token, process.env.JWT_SECRET || "defaultsecret", (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
    req.user = user;
    next();
  });
};

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user) {
      if (password === user.password) {
        const token = jwt.sign(
          { email: user.email },
          process.env.JWT_SECRET || "defaultsecret",
          { expiresIn: "1h" }
        );

        return res.status(200).json({
          message: "Login Successful",
          token,
        });
      } else {
        return res.status(401).json({
          message: "Invalid email or password",
        });
      }
    } else {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
});

app.get("/dashboard", authenticateToken, (req, res) => {
  res.status(200).json({
    message: `Welcome to your dashboard, ${req.user.email}`,
  });
});

app.post("/signUp",async(req,res)=>{
  try{
    const {email,password}=req.body;
    
    const user=await User.findOne({email});

    if(user){
      // console.log("User exists");
        return res.status(409).json({
          message:"Email id already exists"
        });
      }
    else{
      const newUser=new User({
        email,password
      });

      await newUser.save();
      
      // console.log("User registered");
      return res.status(200).json({
        message:"User registered successfully"
      });
    }
    }
  catch(error){
    console.log(error);
    res.status(500).json({
      message:"Server Error"
    });
  }
})

app.listen(process.env.PORT, () => {
  console.log("Server running successfully");
});