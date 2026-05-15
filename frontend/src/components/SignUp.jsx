import React, { useState } from "react";
import { Link } from "react-router-dom";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      const signupDetails = {
        email,
        password,
      };

      const response = await fetch("http://localhost:5000/signUp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signupDetails),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Signup Successful");
        window.location.href = "/login";
      } else {
        alert(data.message || "Signup Failed");
      }
    } catch (error) {
      console.log("Fetch Error:", error);
      alert("Backend not connected");
    }
  };

  return (
    <div>
      <form onSubmit={handleSignUp}>
        <h3>Email</h3>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <h3>Password</h3>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <br />

        <button type="submit">SignUp</button>

        <h3>
          Already have an account? <Link to="/login">Login</Link>
        </h3>
      </form>
    </div>
  );
};

export default SignUp;