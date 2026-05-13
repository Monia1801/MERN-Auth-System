import React,{useState} from 'react'

const SignUp = () => {
  const[email,setEmail]=useState("");
  const [password,setPassword]=useState("");

  const handleSignUp=async(e)=>{
    e.preventDefault();

    const signupDetails={
      email:email,
      password:password
    };

    const response=await fetch("http://localhost:5000/signUp",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify(signupDetails)
    });

  }

  return (
    <div>
      <form onSubmit={handleSignUp}>
        <h3>Email</h3>
        <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)}/>

        <h3>Password</h3>
        <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
        <br></br>

        <button type="submit">SignUp</button>
      </form>
    </div>
  )
}

export default SignUp
