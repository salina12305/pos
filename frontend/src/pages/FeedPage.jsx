import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import Navbar from './components/Navbar';
import { getPublishedPostsApi } from '../services/api';
import { 
    ChatBubbleLeftIcon, 
    HeartIcon, 
    PencilSquareIcon, 
    TrashIcon,
    XMarkIcon,
    BookOpenIcon 
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";

const API_BASE_URL = "http://localhost:3000";

const FeedPage = () => {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [selectedPost, setSelectedPost] = useState(null);

    // Get current user to check for ownership of posts
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;
    const currentUserId = user?.id || user?.userId; // Adjust based on your backend key

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                // const response = await fetch(`${API_BASE_URL}/api/posts/published`);
                // const result = await response.json();
                
                // // Handling both { success: true, data: [] } and direct array responses
                // const postData = result.success ? result.data : result;
                // setPosts(Array.isArray(postData) ? postData : []); 
                const response = await getPublishedPostsApi();
                setPosts(response.data.data);
            } catch (err) {
                console.error("Failed to fetch posts:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    return (
        <div className="min-h-screen bg-[#F8F9FA] font-sans">
            <Navbar />

            <main className="max-w-4xl mx-auto py-10 px-6">
                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-8">
                    Trending Stories
                </h2>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-700"></div>
                    </div>
                ) : posts.length > 0 ? (
                    <div className="grid grid-cols-1 gap-8">
                        {posts.map((post) => (
                            <PostCard 
                                key={post.id || post._id} 
                                post={post} 
                                currentUserId={currentUserId}
                                onCardClick={() => setSelectedPost(post)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[2.5rem] border border-dashed border-gray-200 shadow-sm">
                        <div className="bg-emerald-50 p-4 rounded-full mb-4">
                            <BookOpenIcon className="w-12 h-12 text-emerald-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">No stories to show yet</h3>
                        <p className="text-gray-500 mt-2 italic text-center max-w-xs px-6 font-serif">
                            Be the first to share your thoughts and ideas with the world!
                        </p>
                        <button 
                            onClick={() => navigate("/create-post")}
                            className="mt-8 bg-black text-white px-10 py-3 rounded-full font-bold hover:scale-105 transition active:scale-95 shadow-lg"
                        >
                            Start Writing
                        </button>
                    </div>
                )}
            </main>

            {/* --- FLOATING ACTION BUTTON (FAB) --- */}
            <button 
                onClick={() => navigate("/create-post")}
                className="fixed bottom-8 right-8 w-16 h-16 bg-emerald-700 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-emerald-800 hover:scale-110 active:scale-95 transition-all duration-300 z-50 group"
                title="Create New Post"
            >
                <span className="text-4xl font-light mb-1 group-hover:rotate-90 transition-transform duration-300">+</span>
            </button>

            {selectedPost && (
                <FullPostModal 
                    post={selectedPost} 
                    onClose={() => setSelectedPost(null)} 
                />
            )}
        </div>
    );
};

/* --- Sub-Component: Individual Post Card --- */
const PostCard = ({ post, onCardClick, currentUserId }) => {
    const [isLiked, setIsLiked] = useState(false);

    // FIXED: Corrected ReferenceError by defining isAuthor
    const isAuthor = currentUserId && String(post.userId) === String(currentUserId);

    const handleLike = (e) => {
        e.stopPropagation(); 
        setIsLiked(!isLiked);
    };

    const imageSrc = post.image?.startsWith('http') 
        ? post.image 
        : `${API_BASE_URL}/uploads/${post.image}`;

    return (
        <div onClick={onCardClick} className="bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group">
            <div className="relative h-64 overflow-hidden">
                <img 
                    src={imageSrc} 
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070";
                    }}
                />
            </div>
            
            <div className="p-8">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold text-xs uppercase">
                        {post.author?.charAt(0) || 'U'}
                    </div>
                    <span className="text-sm text-gray-500 font-medium">
                        {post.author} • {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                </div>

                <h3 className="text-2xl font-bold mb-3 leading-tight font-serif text-gray-900 group-hover:text-emerald-700 transition-colors">
                    {post.title}
                </h3>
                <p className="text-gray-600 line-clamp-2 text-lg leading-relaxed font-serif">
                    {post.snippet}
                </p>

                <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between">
                    <div className="flex gap-6">
                        <button onClick={handleLike} className="flex items-center gap-2 group/btn">
                            {isLiked ? 
                                <HeartIconSolid className="w-6 h-6 text-red-500 animate-pulse" /> : 
                                <HeartIcon className="w-6 h-6 text-gray-400 group-hover/btn:text-red-400" />
                            }
                            <span className="text-sm font-bold text-gray-600">{isLiked ? (post.likes?.length || 0) + 1 : (post.likes?.length || 0)}</span>
                        </button>
                        <div className="flex items-center gap-2">
                            <ChatBubbleLeftIcon className="w-6 h-6 text-gray-400" />
                            <span className="text-sm font-bold text-gray-600">{post.comments?.length || 0}</span>
                        </div>
                    </div>
                    
                    {isAuthor && (
                        <div className="flex gap-4">
                            <button onClick={(e) => e.stopPropagation()} className="p-2 hover:bg-blue-50 rounded-full transition">
                                <PencilSquareIcon className="w-5 h-5 text-blue-500" />
                            </button>
                            <button onClick={(e) => e.stopPropagation()} className="p-2 hover:bg-red-50 rounded-full transition">
                                <TrashIcon className="w-5 h-5 text-red-500" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

/* --- Sub-Component: Modal View --- */
const FullPostModal = ({ post, onClose }) => {
    const imageSrc = post.image?.startsWith('http') 
        ? post.image 
        : `${API_BASE_URL}/uploads/${post.image}`;

    return (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-md">
            <div className="bg-white w-full max-w-3xl h-[95vh] sm:h-[90vh] rounded-t-[2.5rem] sm:rounded-[3rem] overflow-y-auto relative shadow-2xl">
                <button 
                    onClick={onClose} 
                    className="fixed sm:absolute top-6 right-6 p-3 bg-white/90 rounded-full shadow-xl z-10 hover:rotate-90 transition duration-300"
                >
                    <XMarkIcon className="w-6 h-6" />
                </button>
                
                <img src={imageSrc} className="w-full h-[45vh] object-cover" alt="Banner" />
                
                <div className="p-10">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-emerald-700 text-white rounded-full flex items-center justify-center font-bold">
                            {post.author?.charAt(0)}
                        </div>
                        <div>
                            <p className="font-bold text-gray-900">{post.author}</p>
                            <p className="text-xs text-gray-500 uppercase tracking-widest">{new Date(post.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                    
                    <h2 className="text-4xl font-extrabold mb-8 font-serif leading-tight text-gray-900">
                        {post.title}
                    </h2>
                    
                    <p className="text-xl text-gray-700 leading-loose mb-10 whitespace-pre-wrap font-serif">
                        {post.snippet}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default FeedPage;