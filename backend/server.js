const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const path = require("path");

require("dotenv").config();

const app = express();

const FRONTEND_URL = process.env.FRONTEND_URL || "";
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: FRONTEND_URL || true,
  credentials: true,
}));
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI;
if (MONGO_URI) {
  mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("Mongo DB connected successfully");
  })
  .catch((error) => {
    console.log(error);
  });
} else {
  console.log("No MONGO_URI provided — skipping MongoDB connection.");
}

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

// Serve frontend in production when built
if (process.env.NODE_ENV === "production") {
  const frontendDist = path.join(__dirname, "..", "frontend", "dist");
  app.use(express.static(frontendDist));

  app.get((req, res) => {
    res.sendFile(path.join(frontendDist, "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`Server running successfully on port ${PORT}`);
});