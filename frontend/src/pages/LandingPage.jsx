import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PostifyLogin from "./Login";
import PostifyRegister from "./Register";
import ForgotPw from "./ForgotPw";

const LandingPage = () => {
  const navigate = useNavigate();
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [forgotPwOpen, setForgotPwOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f5f1e8] text-black font-serif">

      {/* Navbar */}
      <header className="flex justify-between items-center px-10 py-6 border-b border-gray-300">
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>          
        <img src="logo.png" alt="Postify Logo" className="w-14 h-14 object-contain"/>
        <div className="text-2xl font-bold">Postify</div>
      </div>

        <nav className="flex items-center gap-8 font-sans text-[16px]">
          <Link
            to="/about"
            className="font-bold text-[#2D7DBF] hover:underline" >
            About
          </Link>

          <button
            className="font-bold text-[#2D7DBF] hover:underline"
            onClick={() => setLoginOpen(true)}>
            Login
          </button>
        </nav>
      </header>

      <section className="flex flex-col md:flex-row items-center justify-between px-10 py-20">
        <div className="max-w-xl">
          <h1 className="text-6xl md:text-7xl font-bold leading-tight">
            Human <br /> stories & ideas
          </h1>
          <p className="text-lg mt-6 font-sans">
            Made for writers, dreamers, and storytellers.
          </p>
          <button 
            className="mt-8 bg-black text-white text-xl px-10 py-3 rounded-full font-sans"
          >
            Start reading
          </button>
        </div>

        <div className="mt-16 md:mt-0 flex flex-col items-center">
          <div className="w-60 h-60 bg-green-600 rounded-full opacity-90"></div>
          <div className="w-80 h-56 bg-green-600 mt-10 flex items-center justify-center">
            <div className="w-32 h-32 bg-white"></div>
          </div>
        </div>
      </section>

      {loginOpen && (
        <PostifyLogin
          setOpen={setLoginOpen}
          openRegister={() => {
            setLoginOpen(false);
            setRegisterOpen(true);
          }}
          openForgotPw={() => {
            setLoginOpen(false);
            setForgotPwOpen(true);
          }}
        />
      )}

      {registerOpen && (
        <PostifyRegister
          setOpen={setRegisterOpen}
          openLogin={() => {
            setRegisterOpen(false);
            setLoginOpen(true);
          }}
        />
      )}

      {forgotPwOpen && (
        <ForgotPw
          setOpen={setForgotPwOpen}
          openLogin={() => {
            setForgotPwOpen(false);
            setLoginOpen(true);
          }}
        />
      )}
    </div>
  );
};

export default LandingPage;
