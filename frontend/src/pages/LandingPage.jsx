
import React, { useState } from "react";
import PostifyLogin from "./Login";
import PostifyRegister from "./Register";
import ForgotPw from "./ForgotPw";

const PostifyStyleLandingPage = () => {
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [forgotPwOpen, setForgotPwOpen] = useState(false);


  return (
    <div className="min-h-screen bg-[#f5f1e8] text-black font-serif">

      {/* Navbar */}
      <header className="flex justify-between items-center px-10 py-6 border-b border-gray-300">
      <div className="flex items-center gap-2">
          <img 
           src="logo.png" 
           alt="Postify Logo" 
           className="w-w-15 h-15 object-contain " 
          />
         <div className="text-2xl font-bold">Postify</div>
      </div>

        <nav className="flex items-center gap-8 font-sans">

          <button className="hover:underline">About Us</button>

          <button 
            className="hover:underline"
            onClick={() => setLoginOpen(true)}
          >
            Sign in
          </button>

        </nav>
      </header>

      {/* Hero */}
      <section className="flex flex-col md:flex-row items-center justify-between px-10 py-20">
        <div className="max-w-xl">
          <h1 className="text-6xl md:text-7xl font-bold leading-tight">
            Human <br /> stories & ideas
          </h1>
          <p className="text-lg mt-6 font-sans">
            Made for writers, dreamers, and storytellers.
          </p>
        </div>

        {/* Graphics */}
        <div className="mt-16 md:mt-0 flex flex-col items-center">
          <div className="w-60 h-60 bg-green-600 rounded-full opacity-90"></div>
          <div className="w-80 h-56 bg-green-600 mt-10 flex items-center justify-center">
            <div className="w-32 h-32 bg-white"></div>
          </div>
        </div>
      </section>

      {/* Modals */}
      {loginOpen && (
        <PostifyLogin 
          setOpen={setLoginOpen}
          openRegister={() => {
            setLoginOpen(false);
            setRegisterOpen(true);
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

       {/* FORGOT PASSWORD MODAL */}
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

export default PostifyStyleLandingPage;

