import React,{useState} from 'react'
import {Link, useNavigate} from "react-router-dom"

const Login = () => {
  const[email,setEmail]=useState("") ;
  const [password,setPassword]=useState("");
  const navigate = useNavigate();

  const handleSubmit=async(e)=>{
    e.preventDefault();

    const userDetails={
      email:email,
      password:password
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(userDetails)
      });

      const data = await response.json();

      if(response.ok){
        if(data.token){
          localStorage.setItem("token", data.token);
          navigate("/dashboard");
        } else {
          alert("Login succeeded but no token returned");
        }
      } else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login fetch error:", error);
      alert("Backend not connected");
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h3>Enter Email</h3>
        <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)}/>

        <h3>Enter password</h3>
        <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
        <br></br>

        <button type="submit">Login</button>
        <h3>Dont have an account?<Link to="/">SignUp</Link></h3>
      </form>
    </div>
  )
}

export default Login
