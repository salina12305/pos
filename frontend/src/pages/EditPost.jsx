import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSinglePostApi, updatePostApi } from '../services/api';
import Navbar from './components/Navbar';
import { PhotoIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import toast from 'react-hot-toast';

const EditPost = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    // --- Form State ---
    const [title, setTitle] = useState("");
    const [snippet, setSnippet] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [author, setAuthor] = useState("");

    // --- Fetch Existing Data ---
    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await getSinglePostApi(id);
                if (res.data.success) {
                    const post = res.data.data;
                    setTitle(post.title);
                    setSnippet(post.snippet);
                    setAuthor(post.author || "Unknown");
                    // Show existing image as initial preview
                    setImagePreview(`${import.meta.env.VITE_API_BASE_URL}/uploads/${post.image}`);
                }
            } catch (err) {
                toast.error("Failed to load post data");
                navigate('/feedpage');
            }
        };
        fetchPost();
    }, [id, navigate]);

    // --- Image Selection Handler ---
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                return toast.error("Image is too large (Limit: 5MB)");
            }
            setSelectedImage(file);
            setImagePreview(URL.createObjectURL(file));
            toast.success("New image selected!");
        }
    };

    // --- Update Logic ---
    const handleUpdate = async () => {
        if (!title.trim()) return toast.error("Please enter a story title.");
        if (!snippet.trim()) return toast.error("Your story content cannot be empty.");

        setIsLoading(true);
        const loadId = toast.loading("Updating your story...");

        const formData = new FormData();
        formData.append('title', title);
        formData.append('snippet', snippet);
        // Only append image if the user actually selected a new file
        if (selectedImage) {
            formData.append('image', selectedImage);
        }

        try {
            const response = await updatePostApi(id, formData);
            if (response.data.success) {
                toast.success("Changes saved successfully!", { id: loadId });
                setTimeout(() => navigate("/feedpage"), 1000);
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || "Error updating story";
            toast.error(errorMsg, { id: loadId });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8F9FA] font-sans pb-20">
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
                    
                    {/* --- Image Picker --- */}
                    <div 
                        onClick={() => fileInputRef.current.click()}
                        className="relative h-72 bg-gray-50 border-b border-gray-100 cursor-pointer group flex items-center justify-center overflow-hidden"
                    >
                        {imagePreview ? (
                            <>
                                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center">
                                    <p className="text-white font-bold px-4 py-2 border border-white rounded-full">Change Cover Image</p>
                                </div>
                            </>
                        ) : (
                            <div className="text-center group-hover:scale-110 transition duration-300">
                                <PhotoIcon className="w-16 h-16 text-gray-200 mx-auto mb-2" />
                                <p className="text-gray-400 font-medium">Tap to select a cover image</p>
                            </div>
                        )}
                        <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
                    </div>

                    <div className="p-10">
                        {/* Meta Info */}
                        <div className="flex items-center justify-between mb-8">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                Author: <span className="text-emerald-700">{author}</span>
                            </p>
                            <span className="px-3 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-full uppercase">
                                Editing Mode
                            </span>
                        </div>

                        {/* --- Form Inputs --- */}
                        <div className="space-y-6">
                            <input 
                                type="text" 
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Story Title"
                                className="w-full text-4xl font-serif font-bold border-none focus:ring-0 placeholder:text-gray-200 p-0"
                            />
                            
                            <div className="h-[1px] bg-gray-100 w-1/4"></div>

                            <textarea 
                                rows="10"
                                value={snippet}
                                onChange={(e) => setSnippet(e.target.value)}
                                placeholder="Edit your story content..."
                                className="w-full text-xl font-serif text-gray-600 border-none focus:ring-0 placeholder:text-gray-200 p-0 resize-none leading-relaxed"
                            ></textarea>
                        </div>

                        {/* --- Action Buttons --- */}
                        <div className="mt-12 flex flex-col sm:flex-row gap-4">
                            <button 
                                type="button"
                                onClick={() => navigate(-1)}
                                className="flex-1 py-4 rounded-2xl font-bold text-gray-500 border-2 border-gray-100 hover:bg-gray-50 transition active:scale-95"
                            >
                                Cancel
                            </button>
                            
                            <button 
                                onClick={handleUpdate}
                                disabled={isLoading}
                                className={`flex-[2] py-4 rounded-2xl font-bold text-white shadow-xl transition flex items-center justify-center gap-3
                                    ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-emerald-700 hover:bg-emerald-800 hover:scale-[1.02] active:scale-95'}`}
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    "Save Changes"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default EditPost;