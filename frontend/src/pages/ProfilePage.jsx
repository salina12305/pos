import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { getUserById } from '../services/api'; 
import { 
    ArrowLeftOnRectangleIcon, 
    PencilSquareIcon, 
    BookOpenIcon, 
    ChevronRightIcon
} from "@heroicons/react/24/outline";

const ProfilePage = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [postCount, setPostCount] = useState(0);

    // Get current user info from localStorage
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const userId = storedUser?.id || localStorage.getItem("userId");

    // Helper function to format the date (e.g., "February 2026")
    const formatDate = (dateString) => {
        if (!dateString) return "Recent";
        const options = { month: 'long', year: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Logout Function
    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    };

    useEffect(() => {
        if (!userId) {
            navigate("/");
            return;
        }

        const fetchProfile = async () => {
            try {
                const response = await getUserById(userId);
                setUserData(response.data);
                // Logic: update this once your backend returns posts
                setPostCount(response.data.posts?.length || 0); 
            } catch (err) {
                console.error("Profile fetch error", err);
            }
        };
        fetchProfile();
    }, [userId, navigate]);

    return (
        <div className="min-h-screen bg-[#fdfbf7] font-serif text-[#1a1a1a]">
            
            {/* --- Header / Navigation --- */}
            <header className="w-full border-b border-gray-100 bg-white/50 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-5xl mx-auto flex justify-between items-center p-6 px-8">
                    <button 
                        onClick={() => navigate(-1)} 
                        className="group flex items-center gap-2 text-sm font-sans font-bold uppercase tracking-widest hover:text-emerald-700 transition outline-none focus:outline-none"
                    >
                        <span className="group-hover:-translate-x-1 transition-transform">←</span> 
                        Back to Feed
                    </button>

                    <button 
                        onClick={handleLogout} 
                        className="group flex items-center gap-2 text-sm font-sans font-bold uppercase tracking-widest text-red-500 hover:text-red-700 transition outline-none focus:outline-none"
                    >
                        Logout 
                        <ArrowLeftOnRectangleIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-8 pb-20 grid grid-cols-1 md:grid-cols-3 gap-16 mt-10">

                {/* --- Left Column: Identity Card --- */}
                <div className="md:col-span-1">
                    <div className="sticky top-24">
                        <div className="relative group w-40 h-40 mx-auto md:mx-0">
                            {/* Decorative ring */}
                            <div className="absolute inset-0 border-2 border-emerald-600 rounded-full scale-110 opacity-20 group-hover:scale-125 transition duration-500"></div>
                            
                            <div className="w-full h-full bg-[#1A365D] rounded-full flex items-center justify-center text-white text-6xl shadow-2xl relative z-10">
                                {userData?.username?.charAt(0).toUpperCase() || "U"}
                            </div>
                        </div>
              
                        <div className="mt-8 text-center md:text-left">
                            <h1 className="text-4xl font-bold tracking-tight">
                                {userData?.username || "Storyteller"}
                            </h1>
                            <p className="text-gray-500 font-sans mt-2">{userData?.email}</p>
                            
                            <div className="mt-6 flex flex-wrap gap-2 justify-center md:justify-start">
                                <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-sans font-bold uppercase">
                                   Member since {formatDate(userData?.createdAt)}
                                </span>                           
                            </div>
                        </div>
                    </div>
                </div> 

                {/* --- Right Column: Personal Archive --- */}
                <div className="md:col-span-2 space-y-10">
                    
                    {/* Activity Stats Card */}
                    <div className="bg-emerald-900 rounded-[2rem] p-8 text-white flex items-center justify-between overflow-hidden relative shadow-xl">
                        <div className="relative z-10">
                            <p className="text-emerald-200 font-sans text-xs font-bold uppercase tracking-[0.2em] mb-2">My Activity</p>
                            <h2 className="text-5xl font-bold">{postCount}</h2>
                            <p className="text-emerald-100 italic opacity-80">Stories Published</p>
                        </div>
                        <BookOpenIcon className="w-32 h-32 absolute -right-6 -bottom-6 text-emerald-800 opacity-50 rotate-12" />
                    </div>

                    {/* Drafts Section */}
                    <section>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold italic">Your Drafts</h3>
                        </div>
                        
                        <div className="space-y-4">
                            {postCount > 0 ? (
                                // Map through real posts if they exist
                                userData?.posts?.map((post) => (
                                    <div key={post.id} className="group cursor-pointer bg-white border border-gray-100 p-6 rounded-2xl flex items-center justify-between hover:border-emerald-200 hover:shadow-md transition-all">
                                        <div className="flex items-center gap-5">
                                            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 group-hover:bg-emerald-100 group-hover:text-emerald-600 transition">
                                                <PencilSquareIcon className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-800">{post.title || "Untitled Story"}</h4>
                                                <p className="text-sm font-sans text-gray-400">Last edited {formatDate(post.updatedAt)}</p>
                                            </div>
                                        </div>
                                        <ChevronRightIcon className="w-5 h-5 text-gray-300" />
                                    </div>
                                ))
                            ) : (
                                // Clean empty state
                                <div className="py-10 text-center border-2 border-dashed border-gray-100 rounded-3xl">
                                    <p className="text-gray-400 font-sans text-sm italic">
                                        Your archive is empty. Start your first draft below.
                                    </p>
                                </div>
                            )}

                            {/* New Draft Button */}
                            <button 
                                onClick={() => navigate("/create-post")}
                                className="w-full border-2 border-dashed border-gray-200 py-4 rounded-2xl font-sans text-sm font-bold text-gray-400 hover:border-emerald-300 hover:text-emerald-600 transition duration-300"
                            >
                                + Create New Draft
                            </button>
                        </div>
                    </section>

                    {/* Footer Bio area */}
                    <footer className="pt-10 border-t border-gray-100">
                        <p className="text-gray-400 text-sm leading-relaxed font-sans italic">
                            This is your private corner of Postify. Only you can see your unpublished drafts and activity statistics. 
                            Keep writing, the world is waiting for your next story.
                        </p>
                    </footer>
                </div>
            </main>
        </div>
    );
};

export default ProfilePage;