import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline"; 
import { createUserApi } from "../services/api";

const PostifyRegister = ({ setOpen, openLogin }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const validate = () => {
        if (!formData.username.trim()) {
            toast.error('Username is required');
            return false;
        }
        if (!formData.email.trim()) {
            toast.error('Email is required');
            return false;
        }
        if (!/\S+@\S+\.\S+/.test(formData.email)) {
            toast.error('Invalid email format');
            return false;
        }
        if (!formData.password.trim()) {
            toast.error('Passwords is required');
            return false;
        }
        if (formData.password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return false;
        }
        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        try {
            const dataToSubmit = {
                username: formData.username, 
                email: formData.email,
                password: formData.password,
                confirmPassword: formData.confirmPassword,
            };
            const response=await createUserApi(dataToSubmit) ;
            if (response.status === 200 || response.status === 201) {
                const userId = response.data.id; 
               localStorage.setItem('tempUserId', userId);
               toast.success("User created successfully!");
               setTimeout(() => {
                navigate("/login");
              }, 2000);
            } else {
            toast.error(response.data.message || "User creation failed!");
           } 
        } catch (error) {
            console.error("Error Object:", error);
            const errorMessage = error.response?.data?.message || error.message || 'Server is unreachable';
            toast.error(errorMessage);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
            <div className="bg-white p-10 rounded-xl w-[450px] shadow-2xl relative">
                
                <button onClick={() => setOpen(false)} className="absolute top-4 right-4 text-2xl text-gray-400">×</button>

                <h2 className="text-center text-3xl font-semibold mb-8">Join Postify</h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                        <label className="text-sm font-medium text-gray-700 ml-1">Username</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="johndoe"
                            className="w-full mt-1 border px-4 py-3 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none transition"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="text-sm font-medium text-gray-700 ml-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="name@example.com"
                            className="w-full mt-1 border px-4 py-3 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none transition"
                        />
                    </div>
                    
                    {/* Password Field */}
                    <div className="relative">
                        <label className="text-sm font-medium text-gray-700 ml-1">Password</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Create a password"
                            className="w-full mt-1 border px-4 py-3 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-[42px] text-gray-400"
                        >
                            {!showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                        </button>
                    </div>

                    {/* Confirm Password Field */}
                    <div className="relative">
                        <label className="text-sm font-medium text-gray-700 ml-1">Confirm Password</label>
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Repeat your password"
                            className="w-full mt-1 border px-4 py-3 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-4 top-[42px] text-gray-400"
                        >
                            {!showConfirmPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                        </button>
                        {/* <Button label={"register"} onclick={handleSubmit}/> */}
                    </div>

                    <button type="submit" className="bg-black text-white font-medium py-3 rounded-full mt-4">
                        Sign Up
                    </button>
                </form>

                <p className="text-center mt-8 text-sm">
                    Already have an account? <button className="text-emerald-600 font-semibold hover:underline" onClick={openLogin}>Sign In</button>
                </p>
            </div>
        </div>
    );
}

export default PostifyRegister;