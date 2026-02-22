import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { 
    getUserById, 
    getUserDraftsApi, 
    getPublishedPostsApi, 
    deletePostApi 
} from '../services/api'; 
import { 
    ArrowLeftOnRectangleIcon, 
    PencilSquareIcon, 
    BookOpenIcon, 
    ChevronRightIcon,
    TrashIcon,
    CheckBadgeIcon
} from "@heroicons/react/24/outline";
import toast from 'react-hot-toast';

const ProfilePage = () => {
    const navigate = useNavigate();
    
    // --- State Management ---
    const [userData, setUserData] = useState(null);
    const [drafts, setDrafts] = useState([]);
    const [publishedCount, setPublishedCount] = useState(0);
    const [publishedPosts, setPublishedPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Get current user info
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const userId = storedUser?.id || storedUser?._id || localStorage.getItem("userId");

    // --- Date Formatter ---
    const formatDate = (dateString) => {
        if (!dateString) return "Recent";
        const options = { month: 'long', year: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // --- Logout Handler ---
    const handleLogout = () => {
        localStorage.clear();
        toast.success("Logged out successfully");
        navigate("/");
    };

    // --- Data Fetching ---
    const fetchProfileData = async () => {
        try {
            setIsLoading(true);
            
            // 1. Fetch User Info
            const userRes = await getUserById(userId);
            setUserData(userRes.data.data || userRes.data);

            // 2. Fetch Drafts specifically
            const draftsRes = await getUserDraftsApi(userId);
            if (draftsRes.data.success) {
                setDrafts(draftsRes.data.data);
            }

            // 3. Fetch Published posts for count/list
            const pubRes = await getPublishedPostsApi();
            const allPub = pubRes.data.data || [];
            const userPub = allPub.filter(p => String(p.userId) === String(userId));
            setPublishedPosts(userPub);
            setPublishedCount(userPub.length);

        } catch (err) {
            console.error("Error loading profile:", err);
            toast.error("Failed to sync your archive.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!userId) {
            navigate("/");
            return;
        }
        fetchProfileData();
    }, [userId]);

    // --- Delete Handler with Toaster ---
    const handleDeleteDraft = async (e, postId) => {
        e.stopPropagation(); // Prevents navigating to Edit page
        
        // Confirmation Toast instead of window.confirm for a better UI
        const confirmToast = toast((t) => (
            <div className="flex flex-col gap-3 font-sans">
                <p className="text-sm font-bold text-white-800">Permanently delete this draft?</p>
                <div className="flex gap-2">
                    <button 
                        onClick={async () => {
                            toast.dismiss(t.id);
                            await executeDelete(postId);
                        }}
                        className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-600 transition"
                    >
                        Yes, Delete
                    </button>
                    <button 
                        onClick={() => toast.dismiss(t.id)}
                        className="bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-gray-200 transition"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        ), { duration: 5000, position: 'top-center' });
    };

    const executeDelete = async (postId) => {
        const loadId = toast.loading("Removing draft...");
        try {
            const res = await deletePostApi(postId);
            if (res.data.success) {
                toast.success("Draft removed forever", { 
                    id: loadId,
                    icon: '🗑️',
                    style: { borderRadius: '12px', background: '#333', color: '#fff' }
                });
                // Update local state (Optimistic UI)
                setDrafts(prev => prev.filter(post => post.id !== postId));
            }
        } catch (err) {
            toast.error("Could not delete draft", { id: loadId });
        }
    };

    return (
        <div className="min-h-screen bg-[#fdfbf7] font-serif text-[#1a1a1a]">
            
            <header className="w-full border-b border-gray-100 bg-white/50 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-5xl mx-auto flex justify-between items-center p-6 px-8">
                    <button 
                        onClick={() => navigate("/feedpage")} 
                        className="group flex items-center gap-2 text-sm font-sans font-bold uppercase tracking-widest hover:text-emerald-700 transition"
                    >
                        <span className="group-hover:-translate-x-1 transition-transform">←</span> 
                        Feed
                    </button>

                    <button 
                        onClick={handleLogout} 
                        className="group flex items-center gap-2 text-sm font-sans font-bold uppercase tracking-widest text-red-500 hover:text-red-700 transition"
                    >
                        Logout 
                        <ArrowLeftOnRectangleIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-8 pb-20 grid grid-cols-1 md:grid-cols-3 gap-16 mt-10">

                {/* --- Identity --- */}
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
                            <p className="text-gray-500 font-sans mt-2 italic">{userData?.email}</p>
                            <div className="mt-6">
                                <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-[10px] font-sans font-bold uppercase">
                                   Joined {formatDate(userData?.createdAt)}
                                </span>                           
                            </div>
                        </div>
                    </div>
                </div> 

                {/* --- Archive --- */}
                <div className="md:col-span-2 space-y-12">
                    
                    {/* Stats */}
                    <div className="bg-emerald-900 rounded-[2.5rem] p-10 text-white flex items-center justify-between overflow-hidden relative shadow-2xl">
                        <div className="relative z-10">
                            <p className="text-emerald-200 font-sans text-xs font-bold uppercase tracking-[0.2em] mb-2">Total Published Story</p>
                            <h2 className="text-6xl font-bold">{publishedCount}</h2>
                            <p className="text-emerald-100 italic opacity-80 mt-2">Stories Published</p>
                        </div>
                        <BookOpenIcon className="w-40 h-40 absolute -right-6 -bottom-6 text-emerald-800 opacity-40 rotate-12" />
                    </div>

                    {/* Drafts List */}
                    <section>
                        <h3 className="text-2xl font-bold italic mb-6">Draft Stories</h3>
                        
                        <div className="space-y-4">
                            {isLoading ? (
                                <div className="animate-pulse h-24 bg-white rounded-2xl border border-gray-100"></div>
                            ) : drafts.length > 0 ? (
                                drafts.map((post) => (
                                    <div 
                                        key={post.id} 
                                        onClick={() => navigate(`/edit-post/${post.id}`)}
                                        className="group cursor-pointer bg-white border border-gray-100 p-6 rounded-2xl flex items-center justify-between hover:border-emerald-200 hover:shadow-lg transition-all"
                                    >
                                        <div className="flex items-center gap-5">
                                            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition">
                                                <PencilSquareIcon className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-800 group-hover:text-emerald-800 transition">{post.title || "Untitled"}</h4>
                                                <p className="text-xs font-sans text-gray-400">Created {formatDate(post.createdAt)}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-4">
                                            <button 
                                                onClick={(e) => handleDeleteDraft(e, post.id)}
                                                className="p-2 text-gray-200 hover:text-red-500 transition-colors"
                                            >
                                                <TrashIcon className="w-5 h-5" />
                                            </button>
                                            <ChevronRightIcon className="w-5 h-5 text-gray-200 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="py-12 text-center border-2 border-dashed border-gray-100 rounded-[2rem] bg-white/40">
                                    <p className="text-gray-400 font-sans text-sm italic">The ink has dried. No active drafts.</p>
                                </div>
                            )}

                            <button 
                                onClick={() => navigate("/create-post")}
                                className="w-full border-2 border-dashed border-gray-200 py-5 rounded-[2rem] font-sans text-xs font-bold text-gray-400 hover:border-emerald-300 hover:text-emerald-600 hover:bg-emerald-50/50 transition duration-300"
                            >
                                + CREATE A NEW STORY
                            </button>
                        </div>
                    </section>

                    {/* Published section */}
                    {publishedPosts.length > 0 && (
                        <section className="pt-6">
                            <h3 className="text-xl font-bold text-gray-300 mb-6 font-sans uppercase tracking-[0.2em] text-[10px]">Active in Feed</h3>
                            <div className="grid grid-cols-1 gap-3">
                                {publishedPosts.map(post => (
                                    <div key={post.id} className="flex items-center justify-between p-5 bg-white rounded-2xl border border-gray-100 hover:border-emerald-100 transition shadow-sm">
                                        <div className="flex items-center gap-3">
                                            <CheckBadgeIcon className="w-5 h-5 text-emerald-500" />
                                            <span className="font-bold text-sm text-gray-700 truncate max-w-xs">{post.title}</span>
                                        </div>
                                        <button onClick={() => navigate("/feedpage")} className="text-[10px] font-sans font-bold text-emerald-600 uppercase hover:underline">View Live</button>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    <footer className="pt-10 border-t border-gray-100">
                        <p className="text-gray-300 text-[10px] font-sans uppercase tracking-widest text-center italic">
                            Strictly Private Archive • Only visible to you
                        </p>
                    </footer>
                </div>
            </main>
        </div>
    );
};

export default ProfilePage;