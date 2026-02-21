import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
    const navigate = useNavigate();
    
    // Retrieve the user object from localStorage
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;
    
    // Logic: Use username if available, otherwise fallback to email or "User"
    const displayName = user?.username && user.username !== "User" 
        ? user.username 
        : (user?.email || "User");

    return (
        <nav className="flex justify-between items-center px-10 py-4 bg-white border-b sticky top-0 z-50">
            <h1 
                onClick={() => navigate("/feedpage")} 
                className="text-2xl font-bold tracking-tight text-emerald-800 cursor-pointer"
            >
                Postify
            </h1>
            
            <div className="flex items-center gap-4">
                <span className="text-gray-600 font-medium hidden sm:block">
                    {displayName}
                </span>
                <div 
                    onClick={() => navigate("/profile")}
                    className="w-10 h-10 bg-emerald-700 rounded-full flex items-center justify-center text-white font-bold cursor-pointer hover:bg-emerald-800 transition-colors shadow-sm"
                >
                    {displayName.charAt(0).toUpperCase()}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;