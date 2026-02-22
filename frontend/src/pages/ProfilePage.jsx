import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { getUserById, getUserDraftsApi, getPublishedPostsApi } from '../services/api'; 
import { 
    ArrowLeftOnRectangleIcon, 
    PencilSquareIcon, 
    BookOpenIcon, 
    ChevronRightIcon
} from "@heroicons/react/24/outline";
import toast from 'react-hot-toast';

const ProfilePage = () => {
    const navigate = useNavigate();
    
    // --- State ---
    const [userData, setUserData] = useState(null);
    const [drafts, setDrafts] = useState([]);
    const [publishedCount, setPublishedCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    // Get current user info from localStorage
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const userId = storedUser?.id || storedUser?._id || localStorage.getItem("userId");

    // Helper function to format date
    const formatDate = (dateString) => {
        if (!dateString) return "Recent";
        const options = { month: 'long', year: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const handleLogout = () => {
        localStorage.clear();
        toast.success("Logged out");
        navigate("/");
    };

    useEffect(() => {
        if (!userId) {
            navigate("/");
            return;
        }

        const fetchAllProfileData = async () => {
            try {
                setIsLoading(true);
                
                // 1. Fetch Basic User Profile
                const userResponse = await getUserById(userId);
                setUserData(userResponse.data.data || userResponse.data);

                // 2. Fetch Drafts Specifically
                const draftsResponse = await getUserDraftsApi(userId);
                if (draftsResponse.data.success) {
                    setDrafts(draftsResponse.data.data);
                }

                // 3. Fetch Published Posts to get the count
                // We filter all published posts by this user's ID
                const publishedResponse = await getPublishedPostsApi();
                const allPublished = publishedResponse.data.data || [];
                const userPublished = allPublished.filter(p => String(p.userId) === String(userId));
                setPublishedCount(userPublished.length);

            } catch (err) {
                console.error("Profile load error:", err);
                toast.error("Failed to load your archive.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchAllProfileData();
    }, [userId, navigate]);

    return (
        <div className="min-h-screen bg-[#fdfbf7] font-serif text-[#1a1a1a]">
            
            {/* --- Header --- */}
            <header className="w-full border-b border-gray-100 bg-white/50 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-5xl mx-auto flex justify-between items-center p-6 px-8">
                    <button 
                        onClick={() => navigate("/feedpage")} 
                        className="group flex items-center gap-2 text-sm font-sans font-bold uppercase tracking-widest hover:text-emerald-700 transition outline-none"
                    >
                        <span className="group-hover:-translate-x-1 transition-transform">←</span> 
                        Back to Feed
                    </button>

                    <button 
                        onClick={handleLogout} 
                        className="group flex items-center gap-2 text-sm font-sans font-bold uppercase tracking-widest text-red-500 hover:text-red-700 transition outline-none"
                    >
                        Logout 
                        <ArrowLeftOnRectangleIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-8 pb-20 grid grid-cols-1 md:grid-cols-3 gap-16 mt-10">

                {/* --- Left Column: Identity --- */}
                <div className="md:col-span-1">
                    <div className="sticky top-24">
                        <div className="relative group w-40 h-40 mx-auto md:mx-0">
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

                {/* --- Right Column: Archive --- */}
                <div className="md:col-span-2 space-y-10">
                    
                    {/* Activity Stats Card */}
                    <div className="bg-emerald-900 rounded-[2rem] p-8 text-white flex items-center justify-between overflow-hidden relative shadow-xl">
                        <div className="relative z-10">
                            <p className="text-emerald-200 font-sans text-xs font-bold uppercase tracking-[0.2em] mb-2">My Activity</p>
                            <h2 className="text-5xl font-bold">{publishedCount}</h2>
                            <p className="text-emerald-100 italic opacity-80">Stories Published</p>
                        </div>
                        <BookOpenIcon className="w-32 h-32 absolute -right-6 -bottom-6 text-emerald-800 opacity-50 rotate-12" />
                    </div>

                    {/* Drafts Section */}
                    <section>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold italic">Your Drafts ({drafts.length})</h3>
                        </div>
                        
                        <div className="space-y-4">
                            {isLoading ? (
                                <div className="animate-pulse flex space-x-4 p-6 bg-white rounded-2xl border border-gray-100">
                                    <div className="rounded-full bg-gray-200 h-12 w-12"></div>
                                    <div className="flex-1 space-y-4 py-1">
                                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                    </div>
                                </div>
                            ) : drafts.length > 0 ? (
                                drafts.map((post) => (
                                    <div 
                                        key={post.id} 
                                        onClick={() => navigate(`/edit-post/${post.id}`)}
                                        className="group cursor-pointer bg-white border border-gray-100 p-6 rounded-2xl flex items-center justify-between hover:border-emerald-200 hover:shadow-md transition-all"
                                    >
                                        <div className="flex items-center gap-5">
                                            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 group-hover:bg-emerald-100 group-hover:text-emerald-600 transition">
                                                <PencilSquareIcon className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-800">{post.title || "Untitled Story"}</h4>
                                                <p className="text-sm font-sans text-gray-400">Created {formatDate(post.createdAt)}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 text-emerald-600 opacity-0 group-hover:opacity-100 transition-all transform group-hover:-translate-x-2">
                                            <span className="text-[10px] font-sans font-bold uppercase tracking-tighter">Edit Story</span>
                                            <ChevronRightIcon className="w-5 h-5" />
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="py-10 text-center border-2 border-dashed border-gray-100 rounded-3xl bg-white/30">
                                    <p className="text-gray-400 font-sans text-sm italic">
                                        Your draft archive is empty.
                                    </p>
                                </div>
                            )}

                            {/* Create New Draft Button */}
                            <button 
                                onClick={() => navigate("/create-post")}
                                className="w-full border-2 border-dashed border-gray-200 py-4 rounded-2xl font-sans text-sm font-bold text-gray-400 hover:border-emerald-300 hover:text-emerald-600 hover:bg-emerald-50/50 transition duration-300"
                            >
                                + Create New Draft
                            </button>
                        </div>
                    </section>

                    <footer className="pt-10 border-t border-gray-100">
                        <p className="text-gray-400 text-xs leading-relaxed font-sans italic">
                            Only you can see your unpublished drafts. 
                            Finish writing whenever you're ready to share.
                        </p>
                    </footer>
                </div>
            </main>
        </div>
    );
};

export default ProfilePage;