// // import React, { useState } from 'react';
// // import toast from 'react-hot-toast';
// // // import { registerUserApi } from "../services/api"; // Ensure this API helper exists

// // const PostifyRegister = ({ setOpen, openLogin }) => {
// //     const [formData, setFormData] = useState({
// //         username: "",
// //         email: "",
// //         password: "",
// //     });

// //     const handleChange = (e) => {
// //         setFormData({
// //             ...formData,
// //             [e.target.name]: e.target.value,
// //         });
// //     };

// //     const validate = () => {
// //         if (!formData.username) {
// //             toast.error('Username is required');
// //             return false;
// //         }
// //         if (!formData.email) {
// //             toast.error('Email is required');
// //             return false;
// //         }
// //         if (!/\S+@\S+\.\S+/.test(formData.email)) {
// //             toast.error('Invalid email format');
// //             return false;
// //         }
// //         if (formData.password.length < 6) {
// //             toast.error('Password must be at least 6 characters');
// //             return false;
// //         }
// //         return true;
// //     };

// //     const handleSubmit = async (e) => {
// //         e.preventDefault();
// //         if (!validate()) return;

// //         try {
// //             const response = await registerUserApi(formData);
            
// //             if (response.data.success) {
// //                 toast.success("Account created! Please sign in.");
// //                 openLogin(); // Switch to login modal
// //             } else {
// //                 toast.error(response.data.message || "Registration failed");
// //             }
// //         } catch (error) {
// //             console.error(error);
// //             toast.error('Something went wrong during registration.');
// //         }
// //     };

// //     return (
// //         <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
// //             <div className="bg-white p-10 rounded-xl w-[450px] shadow-2xl relative animate-fadeIn">
                
// //                 {/* Close button */}
// //                 <button
// //                     onClick={() => setOpen(false)}
// //                     className="absolute top-4 right-4 text-2xl text-gray-400 hover:text-black"
// //                 >
// //                     ×
// //                 </button>

// //                 <h2 className="text-center text-3xl font-semibold mb-8">Join Postify</h2>

// //                 <form onSubmit={handleSubmit} className="flex flex-col gap-4">
// //                     {/* Username Input */}
// //                     <div>
// //                         <label className="text-sm font-medium text-gray-700 ml-1">Username</label>
// //                         <input
// //                             type="text"
// //                             name="username"
// //                             value={formData.username}
// //                             onChange={handleChange}
// //                             placeholder="johndoe"
// //                             className="w-full mt-1 border px-4 py-3 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none transition"
// //                         />
// //                     </div>

// //                     {/* Email Input */}
// //                     <div>
// //                         <label className="text-sm font-medium text-gray-700 ml-1">Email</label>
// //                         <input
// //                             type="email"
// //                             name="email"
// //                             value={formData.email}
// //                             onChange={handleChange}
// //                             placeholder="name@example.com"
// //                             className="w-full mt-1 border px-4 py-3 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none transition"
// //                         />
// //                     </div>

// //                     {/* Password Input */}
// //                     <div>
// //                         <label className="text-sm font-medium text-gray-700 ml-1">Password</label>
// //                         <input
// //                             type="password"
// //                             name="password"
// //                             value={formData.password}
// //                             onChange={handleChange}
// //                             placeholder="Create a password"
// //                             className="w-full mt-1 border px-4 py-3 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none transition"
// //                         />
// //                     </div>

// //                     {/* Submit Button */}
// //                     <button 
// //                         type="submit"
// //                         className="bg-black text-white font-medium py-3 rounded-full mt-4 hover:bg-gray-800 transition"
// //                     >
// //                         Sign Up
// //                     </button>
// //                 </form>

// //                 <div className="mt-8 pt-6 border-t border-gray-100 text-center">
// //                     <p className="text-sm">
// //                         Already have an account?{" "}
// //                         <button 
// //                             className="text-pink-600 font-semibold hover:underline"
// //                             onClick={openLogin}
// //                         >
// //                             Sign In
// //                         </button>
// //                     </p>
// //                 </div>

// //                 <p className="text-center text-[10px] mt-6 text-gray-400 px-6">
// //                     By clicking "Sign Up", you accept Postify's <a className="underline">Terms of Service</a> and <a className="underline">Privacy Policy</a>.
// //                 </p>
// //             </div>
// //         </div>
// //     );
// // }

// // export default PostifyRegister;



// // // import React from 'react'

// // // // const PostifyLogin = () => {
// // //     const  PostifyRegister = ({ setOpen, openLogin }) => {
// // //     return (

// // //         <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
// // //           <div className="bg-white p-10 rounded-xl w-[500px] shadow-2xl relative animate-fadeIn">

// // //             {/* Close button */}
// // //             <button
// // //               onClick={() => setOpen(false)}
// // //               className="absolute top-4 right-4 text-2xl"
// // //             >
// // //               ×
// // //             </button>  

// // //             <h2 className="text-center text-3xl mb-8">Join Postify</h2>

// // //             <div className="flex flex-col gap-4">

// // //               {/* Google */}
// // //               <button className="border px-4 py-3 rounded-full flex items-center gap-3 hover:bg-gray-100">
// // //                 <img src="/google.png" className="w-6 h-6" />
// // //                 <span className="w-full text-center">Sign up with Google</span>
// // //               </button>

// // //               {/* Facebook */}
// // //               <button className="border px-4 py-3 rounded-full flex items-center gap-3 hover:bg-gray-100">
// // //                 <img src="/facebook.png" className="w-6 h-6" />
// // //                 <span className="w-full text-center">Sign up with Facebook</span>
// // //               </button>

// // //               {/* Email */}
// // //               <button className="border px-4 py-3 rounded-full flex items-center gap-3 hover:bg-gray-100">
// // //                 <img src="/mail.png" className="w-6 h-6" />
// // //                 <span className="w-full text-center">Sign up with email</span>
// // //               </button>

// // //             </div>

// // //             <p className="text-center mt-6 text-sm">
// // //               Already have account?{" "}
// // //           <a 
// // //             className="underline cursor-pointer"
// // //             onClick={openLogin}
// // //           >
// // //             Sign In
// // //           </a>
// // //         </p>

// // //             <p className="text-center text-xs mt-6 text-gray-500">
// // //             By clicking "Sign Up", you accept Postify's <a className="underline">Terms of Service</a> and <a className="underline">Privacy Policy</a>.            
// // //             </p>
            
// // //           </div>
// // //         </div>
// // //   );
// // // }

// // // export default PostifyRegister



// // // import React, { useState } from "react";
// // // import toast from 'react-hot-toast';
// // // import { createUserApi } from "../services/api";
 
 
// // // const Register = () => {
// // //     const [formData, setFormData] = useState({
// // //         username:"",
// // //         email:"",
// // //         password:"",
// // //         confirmPassword:"",
// // //     });
 
// // //     const handleChange = (e) => {
// // //       setFormData({
// // //         ...formData,
// // //         [e.target.name]:e.target.value,
// // //       });
// // //     };
 
// // //     const validate= () =>{
// // //       if(!formData.username){
// // //         toast.error('Name is required');
// // //         return false;
// // //       }//to valid the form
 
// // //       if(!formData.email){
// // //         toast.error('Email is required');
// // //         return false;
// // //       }
 
// // //       if(!/\S+@\S+\.\S+/.test(formData.email)) {
// // //         toast.error('Invalid email format');
// // //         return false;
// // //       }
   
// // //       if(!formData.password){
// // //         toast.error('Password is required');
// // //         return false;
// // //       }
   
// // //       // if(!formData.password.length<=6){
// // //       //   console.log(formData.password)
// // //       //   toast.error('Password must be at least 6 characters');
// // //       //   return false;
// // //       // }
   
// // //       // if(!formData.password !==formData.confirmPassword){
// // //       //   toast.error('Password do not match');
// // //       //   return false;
// // //       // }
// // //       return true;
// // //     }
 
// // //     const handleSubmit = async (e) => {
// // //       e.preventDefault();
// // //       if (!validate()) return;
// // //       try{
// // //         const dataToSubmit ={
// // //              username: formData.username,
// // //              email: formData.email,
// // //              password: formData.password,
// // //         };
       
// // //         const response = await createUserApi(dataToSubmit);
// // //         if (response.data.success){
// // //           toast.success("user created!")
// // //         }else{
// // //           toast.error("user creation failed!")
// // //         }
     
 
// // //         // toast.success('Registration successful');
// // //         // setFormData({
// // //         // username:"",
// // //         // email:"",
// // //         // password:"",
// // //         // confirmPassword:"",
// // //         // });
// // //       // }catch (error){
// // //       //   toast.error('Something went wrong');
// // //       // }
// // //       }catch (error) {
// // //         console.error("Backend error:", error.response?.data);
// // //         toast.error(error.response?.data?.message || "Something went wrong");
// // //       }
      
// // //     };
 
// // //   return(
// // // <div className="min-h-screen flex items-center justify-center bg-gray-100">
// // //       <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
// // //         <h2 className="text-2xl font-semibold text-center mb-6">
// // //           Create Account
// // //         </h2>
 
// // //         <form className="space-y-4">
// // //           {/* Username */}
// // //           <div>
// // //             <label className="block text-sm font-medium mb-1">
// // //               Username
// // //             </label>
// // //             <input
// // //               type="text"
// // //               name="username"
// // //               value={formData.username}
// // //               onChange={handleChange}
// // //               placeholder="Enter username"
// // //               className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
// // //             />
// // //           </div>
 
// // //           {/* Email */}
// // //           <div>
// // //             <label className="block text-sm font-medium mb-1">
// // //               Email
// // //             </label>
// // //             <input
// // //               type="email"
// // //               name="email"
// // //               value={formData.email}
// // //               onChange={handleChange}
 
// // //               placeholder="Enter email"
// // //               className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
// // //             />
// // //           </div>
 
// // //           {/* Password */}
// // //           <div>
// // //             <label className="block text-sm font-medium mb-1">
// // //               Password
// // //             </label>
// // //             <input
// // //               type="password"
// // //               name="password"
// // //               value={formData.password}
// // //               onChange={handleChange}
// // //               placeholder="Enter password"
// // //               className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
// // //             />
// // //           </div>
// // //           <div>
// // //             <label className="block text-sm font-medium mb-1">
// // //               ConfirmPassword
// // //             </label>
// // //             <input
// // //               type="confirmpassword"
// // //               name="confirmPassword"
// // //               value={formData.confirmPassword}
// // //               onChange={handleChange}
// // //               placeholder="Confirmpassword"
// // //               className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
// // //             />
// // //           </div>
 
// // //           {/* Sign Up Button */}
// // //           <button
// // //             onClick={handleSubmit}
// // //             className="w-full bg-pink-600 text-white py-2 rounded-lg hover:bg-pink-700 transition"
// // //           >
// // //             Sign Up
// // //           </button>
// // //         </form>
// // //       </div>
// // //     </div>
// // //     );
// // //   };
 
// // // export default Register;



// import React, { useState } from 'react';
// import toast from 'react-hot-toast';
// // import { registerUserApi } from "../services/api";
// import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline"; // Install @heroicons/react

// const PostifyRegister = ({ setOpen, openLogin }) => {
//     const [showPassword, setShowPassword] = useState(false);
//     const [formData, setFormData] = useState({
//         username: "",
//         email: "",
//         password: "",
//         confirmPassword: "",
//     });

//     const handleChange = (e) => {
//         setFormData({
//             ...formData,
//             [e.target.name]: e.target.value,
//         });
//     };

//     const validate = () => {
//         if (!formData.username || !formData.email || !formData.password) {
//             toast.error('All fields are required');
//             return false;
//         }
//         if (!/\S+@\S+\.\S+/.test(formData.email)) {
//             toast.error('Invalid email format');
//             return false;
//         }
//         if (formData.password.length < 6) {
//             toast.error('Password must be at least 6 characters');
//             return false;
//         }
//         if (formData.password !== formData.confirmPassword) {
//             toast.error('Passwords do not match');
//             return false;
//         }
//         return true;
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (!validate()) return;

//         try {
//             // Send only the necessary data to the API
//             const { confirmPassword, ...dataToSubmit } = formData;
//             const response = await registerUserApi(dataToSubmit);
            
//             if (response.data.success) {
//                 toast.success("Account created! Please sign in.");
//                 openLogin();
//             } else {
//                 toast.error(response.data.message || "Registration failed");
//             }
//         } catch (error) {
//             toast.error('Something went wrong during registration.');
//         }
//     };

//     return (
//         <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
//             <div className="bg-white p-10 rounded-xl w-[450px] shadow-2xl relative animate-fadeIn">
                
//                 <button
//                     onClick={() => setOpen(false)}
//                     className="absolute top-4 right-4 text-2xl text-gray-400 hover:text-black"
//                 >
//                     ×
//                 </button>

//                 <h2 className="text-center text-3xl font-semibold mb-8">Join Postify</h2>

//                 <form onSubmit={handleSubmit} className="flex flex-col gap-4">
//                     {/* Username */}
                    // <div>
                    //     <label className="text-sm font-medium text-gray-700 ml-1">Username</label>
                    //     <input
                    //         type="text"
                    //         name="username"
                    //         value={formData.username}
                    //         onChange={handleChange}
                    //         placeholder="johndoe"
                    //         className="w-full mt-1 border px-4 py-3 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none transition"
                    //     />
                    // </div>

                    // {/* Email */}
                    // <div>
                    //     <label className="text-sm font-medium text-gray-700 ml-1">Email</label>
                    //     <input
                    //         type="email"
                    //         name="email"
                    //         value={formData.email}
                    //         onChange={handleChange}
                    //         placeholder="name@example.com"
                    //         className="w-full mt-1 border px-4 py-3 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none transition"
                    //     />
                    // </div>

//                     {/* Password */}
//                     <div className="relative">
//                         <label className="text-sm font-medium text-gray-700 ml-1">Password</label>
//                         <input
//                             type={showPassword ? "text" : "password"}
//                             name="password"
//                             value={formData.password}
//                             onChange={handleChange}
//                             placeholder="Create a password"
//                             className="w-full mt-1 border px-4 py-3 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none transition"
//                         />
//                         <button
//                             type="button"
//                             onClick={() => setShowPassword(!showPassword)}
//                             className="absolute right-4 top-[42px] text-gray-400 hover:text-gray-600"
//                         >
//                             {!showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
//                         </button>
//                     </div>

//                     {/* Confirm Password */}
//                     <div className="relative">
//                         <label className="text-sm font-medium text-gray-700 ml-1">Confirm Password</label>
//                         <input
//                             type={showConfirmPassword ? "text" : "password"}
//                             name="confirmPassword"
//                             value={formData.confirmPassword}
//                             onChange={handleChange}
//                             placeholder="Repeat your password"
//                             className="w-full mt-1 border px-4 py-3 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
//                         />
//                         <button
//                             type="button"
//                             onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                             className="absolute right-4 top-[42px] text-gray-400"
//                         >
//                             {showConfirmPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
//                         </button>
//                     </div>

//                     <button 
//                         type="submit"
//                         className="bg-black text-white font-medium py-3 rounded-full mt-4 hover:bg-gray-800 transition"
//                     >
//                         Sign Up
//                     </button>
//                 </form>

//                 <div className="mt-8 pt-6 border-t border-gray-100 text-center">
//                     <p className="text-sm">
//                         Already have an account?{" "}
//                         <button 
//                             className="text-pink-600 font-semibold hover:underline"
//                             onClick={openLogin}
//                         >
//                             Sign In
//                         </button>
//                     </p>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default PostifyRegister;


import React, { useState } from 'react';
import toast from 'react-hot-toast';
// import { registerUserApi } from "../services/api";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline"; 

const PostifyRegister = ({ setOpen, openLogin }) => {
    // Separate states for password visibility
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const validate = () => {
        if (!formData.username || !formData.email || !formData.password) {
            toast.error('All fields are required');
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
            const { confirmPassword, ...dataToSubmit } = formData;
            const response = await registerUserApi(dataToSubmit);
            if (response.data.success) {
                toast.success("Account created!");
                openLogin();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error('Registration failed.');
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
                    </div>

                    <button type="submit" className="bg-black text-white font-medium py-3 rounded-full mt-4">
                        Sign Up
                    </button>
                </form>

                <p className="text-center mt-8 text-sm">
                    Already have an account? <button className="text-pink-600 font-semibold" onClick={openLogin}>Sign In</button>
                </p>
            </div>
        </div>
    );
}

export default PostifyRegister;