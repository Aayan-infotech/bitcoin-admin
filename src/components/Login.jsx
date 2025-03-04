import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast"; // Use toast for better feedback

const Login = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://54.236.98.193:3210/api/auth/login", {
        email,
        password,
      });

      if (res?.data?.success) {
        const token = res?.data?.token;
        if (token) {
          localStorage.setItem("token", token); // Store token
          setIsLoggedIn(true); // Update authentication state

          // Use toast for successful login
          window.location.reload()
          toast.success("Login successful!");

          // Redirect to Home/Dashboard immediately after login
          navigate("/"); // Redirect to Home/Dashboard
        } else {
          toast.error("Login failed: No token received");
        }
      } else {
        toast.error("Invalid Credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded-lg shadow-md w-80">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Password</label>
          <input
            type="password"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
