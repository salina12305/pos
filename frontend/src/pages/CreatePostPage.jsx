import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar'; // Path verified from your screenshot
import { PhotoIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { createPostApi } from '../services/api';

const CreatePostPage = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    // --- Form State ---
    const [title, setTitle] = useState("");
    const [snippet, setSnippet] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // --- User Session ---
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const userEmail = storedUser?.email || "Storyteller";

    // --- Image Selection Handler ---
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    // --- Unified Submit Logic (Handles Draft & Publish) ---
    const handleSubmit = async (status) => {
      if (!title || !snippet || !selectedImage) {
          alert("Please provide a title, content, and an image.");
          return;
      }
  
      setIsLoading(true);
  
      // Prepare FormData
      const formData = new FormData();
      formData.append('title', title);
      formData.append('snippet', snippet);
      formData.append('status', status);
      formData.append('author', userEmail);
      formData.append('userId', storedUser?.id || "123");
      formData.append('image', selectedImage); 
  
      try {
          const response = await createPostApi(formData);
  
          if (response.data.success) {
              console.log("Post Created:", response.data);
              status === 'draft' ? navigate("/profile") : navigate("/feedpage");
          }
      } catch (error) {
          console.error("Submission error:", error);
          // Axios stores the server error message in error.response.data
          alert(error.response?.data?.message || "Error connecting to server");
      } finally {
          setIsLoading(false);
      }
  };

    return (
        <div className="min-h-screen bg-[#F8F9FA] font-sans pb-20">
            {/* Reusable Navbar */}
            <Navbar />

            <main className="max-w-2xl mx-auto py-10 px-6">
                
                {/* Back Button */}
                <button 
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-400 hover:text-emerald-700 font-bold text-sm mb-6 transition"
                >
                    <ArrowLeftIcon className="w-4 h-4" /> BACK
                </button>

                <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                    
                    {/* --- Image Picker (Mirrors Android UI) --- */}
                    <div 
                        onClick={() => fileInputRef.current.click()}
                        className="relative h-72 bg-gray-50 border-b border-gray-100 cursor-pointer group flex items-center justify-center overflow-hidden"
                    >
                        {imagePreview ? (
                            <>
                                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center">
                                    <p className="text-white font-bold px-4 py-2 border border-white rounded-full">Change Image</p>
                                </div>
                            </>
                        ) : (
                            <div className="text-center group-hover:scale-110 transition duration-300">
                                <PhotoIcon className="w-16 h-16 text-gray-200 mx-auto mb-2" />
                                <p className="text-gray-400 font-medium">Tap to select a cover image</p>
                            </div>
                        )}
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleImageChange} 
                            className="hidden" 
                            accept="image/*" 
                        />
                    </div>

                    <div className="p-10">
                        {/* Meta Info */}
                        <div className="flex items-center justify-between mb-8">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                Author: <span className="text-emerald-700">{userEmail}</span>
                            </p>
                            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-full uppercase">
                                New Entry
                            </span>
                        </div>

                        {/* --- Form Inputs --- */}
                        <div className="space-y-6">
                            <input 
                                type="text" 
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Story Title"
                                className="w-full text-4xl font-serif font-bold border-none focus:ring-0 placeholder:text-gray-100 p-0"
                            />
                            
                            <div className="h-[1px] bg-gray-100 w-1/4"></div>

                            <textarea 
                                rows="10"
                                value={snippet}
                                onChange={(e) => setSnippet(e.target.value)}
                                placeholder="Start writing your untold story..."
                                className="w-full text-xl font-serif text-gray-600 border-none focus:ring-0 placeholder:text-gray-100 p-0 resize-none leading-relaxed"
                            ></textarea>
                        </div>

                        {/* --- Action Buttons --- */}
                        <div className="mt-12 flex flex-col sm:flex-row gap-4">
                            <button 
                                onClick={() => handleSubmit('draft')}
                                disabled={isLoading}
                                className="flex-1 py-4 rounded-2xl font-bold text-emerald-800 border-2 border-emerald-100 hover:bg-emerald-50 transition active:scale-95 disabled:opacity-50"
                            >
                                Save as Draft
                            </button>
                            
                            <button 
                                onClick={() => handleSubmit('published')}
                                disabled={isLoading}
                                className={`flex-[2] py-4 rounded-2xl font-bold text-white shadow-xl transition flex items-center justify-center gap-3
                                    ${isLoading ? 'bg-gray-300' : 'bg-emerald-700 hover:bg-emerald-800 hover:scale-[1.02] active:scale-95'}`}
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    "Publish Now"
                                )}
                            </button>
                        </div>

                        <p className="text-center mt-6 text-xs text-gray-400 font-medium">
                            By publishing, your story will be visible to everyone on the Trending Feed.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CreatePostPage;