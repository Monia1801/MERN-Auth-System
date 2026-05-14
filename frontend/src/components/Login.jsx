import React,{useState} from 'react'
import {Link} from "react-router-dom"
import Dashboard from "./Dashboard"

const Login = () => {
  const[email,setEmail]=useState("") ;
  const [password,setPassword]=useState("");

  const handleSubmit=async(e)=>{
    e.preventDefault();

    const userDetails={
      email:email,
      password:password
    };

    const response=await fetch("http://localhost:5000/login",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify(userDetails)
    });

    if(response.ok){
      window.location.href="/dashboard"
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
        <h3>Dont have an account?<Link to="/signup">SignUp</Link></h3>
      </form>
    </div>
  )
}

export default Login
