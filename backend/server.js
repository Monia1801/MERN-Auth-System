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
    // console.log(email);
    // console.log(password);

    const user = await User.findOne({ email });

    if (user) {

      if (password === user.password) {

        return res.status(200).json({
          message: "Login Successful"
        });

      }
      else {

        return res.status(401).json({
          message: "Invalid email or password"
        });

      }

    }
    else {

      return res.status(401).json({
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
    // console.log(error);
    res.status(401).json({
      message:"Server Error"
    });
  }
})

app.listen(5000, () => {
  console.log("Server running successfully");
});