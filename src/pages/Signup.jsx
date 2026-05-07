import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SignUp = () => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const res = await axios.post(
        "https://fittrack-backend1.onrender.com/api/users/register",
        {
          name: data.name,
          email: data.email,
          password: data.password,
          userType: data.userType
        }
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("currentUser", JSON.stringify(res.data.user));
      window.dispatchEvent(new Event("authChange"));

      if (res.data.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-zinc-900 text-black dark:text-white py-12 px-4">
      <div className="max-w-md w-full bg-white dark:bg-zinc-800 shadow-xl rounded-lg p-8">
        <h2 className="text-3xl font-bold mb-6 text-center text-black dark:text-white">
          Sign Up
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input
            {...register("name")}
            placeholder="Full Name"
            className="w-full px-4 py-2 border rounded-lg text-white"
          />

          <input
            {...register("email")}
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 border rounded-lg text-white"
          />

          <input
            {...register("password")}
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border rounded-lg text-white"
          />

          <select
            {...register("userType")}
            defaultValue="user"
            className="w-full px-4 py-2 border rounded-lg text-white"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

          <button
            type="submit"
            className="w-full py-3 bg-emerald-500 text-white font-semibold rounded-full"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
