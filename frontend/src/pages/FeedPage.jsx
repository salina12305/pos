import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom"; // Added useLocation
import Navbar from './components/Navbar';
import { 
    getPublishedPostsApi, 
    deletePostApi, 
    likePostApi, 
    addCommentApi, 
    updateCommentApi, 
    deleteCommentApi 
} from '../services/api';
import toast from 'react-hot-toast'; 
import { 
    ChatBubbleLeftIcon, 
    HeartIcon, 
    PencilSquareIcon, 
    TrashIcon,
    XMarkIcon,
    BookOpenIcon,
    PaperAirplaneIcon
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const FeedPage = () => {
    const navigate = useNavigate();
    const { hash } = useLocation(); // Get the #post-id from URL
    const [posts, setPosts] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [selectedPost, setSelectedPost] = useState(null);

    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;
    const currentUserId = user?.id || user?.userId || user?._id;

    const fetchPosts = async () => {
        try {
            setLoading(true);
            const response = await getPublishedPostsApi();
            const postData = response.data.success ? response.data.data : response.data;
            const finalPosts = Array.isArray(postData) ? postData : [];
            setPosts(finalPosts);

            if (selectedPost) {
                const updatedSelected = finalPosts.find(p => (p._id || p.id) === (selectedPost._id || selectedPost.id));
                if (updatedSelected) setSelectedPost(updatedSelected);
            }
        } catch (err) {
            console.error("Fetch error:", err);
            toast.error("Failed to load stories.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { 
        fetchPosts(); 
    }, []);

    // --- SCROLL TO SEARCH RESULT LOGIC ---
    useEffect(() => {
        if (hash && posts.length > 0) {
            const targetId = hash.replace('#', '');
            const element = document.getElementById(targetId);
            
            if (element) {
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    
                    // Add a temporary highlight effect
                    element.classList.add('ring-4', 'ring-emerald-500', 'ring-offset-4');
                    setTimeout(() => {
                        element.classList.remove('ring-4', 'ring-emerald-500', 'ring-offset-4');
                    }, 3000);
                }, 500); // Small delay to ensure browser rendering
            }
        }
    }, [hash, posts]);

    return (
        <div className="min-h-screen bg-[#F8F9FA] font-sans pb-10">
            <Navbar />
            <main className="max-w-4xl mx-auto py-10 px-6">
                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-8">Trending Stories</h2>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-700"></div>
                    </div>
                ) : posts.length > 0 ? (
                    <div className="grid grid-cols-1 gap-8">
                        {posts.map((post) => (
                            <PostCard 
                                key={post._id || post.id} 
                                // ID is crucial for the scrolling logic
                                id={`post-${post._id || post.id}`} 
                                post={post} 
                                currentUserId={currentUserId}
                                onCardClick={() => setSelectedPost(post)}
                                onDeleteRefresh={fetchPosts}
                                navigate={navigate}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[2.5rem] border border-dashed border-gray-200">
                        <BookOpenIcon className="w-12 h-12 text-emerald-600 mb-4" />
                        <h3 className="text-xl font-bold">No stories yet</h3>
                        <button onClick={() => navigate("/create-post")} className="mt-8 bg-black text-white px-10 py-3 rounded-full font-bold shadow-lg">Start Writing</button>
                    </div>
                )}
            </main>

            <button onClick={() => navigate("/create-post")} className="fixed bottom-8 right-8 w-16 h-16 bg-emerald-700 text-white rounded-full shadow-2xl flex items-center justify-center z-50 group hover:scale-110 transition">
                <span className="text-4xl group-hover:rotate-90 transition-transform">+</span>
            </button>

            {selectedPost && <FullPostModal post={selectedPost} user={user} onClose={() => setSelectedPost(null)} onRefresh={fetchPosts} />}
        </div>
    );
};

/* --- PostCard Component --- */
const PostCard = ({ id, post, onCardClick, currentUserId, onDeleteRefresh, navigate }) => {
    const isAuthor = currentUserId && String(post.userId) === String(currentUserId);
    const isLiked = post.likes && Array.isArray(post.likes) 
        ? post.likes.includes(String(currentUserId)) 
        : false;

    const handleLike = async (e) => {
        e.stopPropagation();
        if (!currentUserId) return toast.error("Please log in to like.");
        try {
            const response = await likePostApi(post._id || post.id, currentUserId);
            if (response.data.success) onDeleteRefresh(); 
        } catch (err) {
            toast.error("Failed to update like.");
        }
    };

    const handleDelete = (e) => {
        e.stopPropagation();
        toast((t) => (
            <div className="flex flex-col items-center gap-3">
                <p className="font-semibold text-white text-sm text-center">Delete this story permanently?</p>
                <div className="flex gap-2">
                    <button onClick={async () => {
                        toast.dismiss(t.id);
                        try {
                            const response = await deletePostApi(post._id || post.id);
                            if (response.data.success) {
                                toast.success("Story deleted!");
                                onDeleteRefresh();
                            }
                        } catch (err) { toast.error("Could not delete."); }
                    }} className="bg-red-500 px-4 py-1.5 rounded-lg text-white text-xs font-bold hover:bg-red-600">Delete</button>
                    <button onClick={() => toast.dismiss(t.id)} className="bg-gray-600 px-4 py-1.5 rounded-lg text-white text-xs font-bold hover:bg-gray-500">Cancel</button>
                </div>
            </div>
        ), { duration: 5000, style: { background: '#333' } });
    };

    const imageSrc = post.image?.startsWith('http') 
        ? post.image 
        : `${API_BASE_URL}/uploads/${post.image}`;
    const fallbackImage = "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80";

    return (
        <div 
            id={id} // Crucial: This links with the Search Page navigate hash
            onClick={onCardClick} 
            className="bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer group"
        >
            <div className="relative h-64 overflow-hidden">
                <img 
                    src={imageSrc} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    onError={(e) => { e.target.onerror = null; e.target.src = fallbackImage; }} 
                    alt={post.title}
                />
            </div>
            
            <div className="p-8">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold text-xs uppercase">{post.author?.charAt(0)}</div>
                    <span className="text-sm text-gray-500 font-medium">{post.author} • {new Date(post.createdAt).toLocaleDateString()}</span>
                </div>

                <h3 className="text-2xl font-bold mb-3 font-serif group-hover:text-emerald-700 transition-colors">{post.title}</h3>
                <p className="text-gray-600 line-clamp-2 text-lg font-serif">{post.snippet}</p>

                <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between">
                    <div className="flex gap-6">
                        <button onClick={handleLike} className="flex items-center gap-2 group/btn">
                            {isLiked ? <HeartIconSolid className="w-6 h-6 text-red-500" /> : <HeartIcon className="w-6 h-6 text-gray-400 group-hover/btn:text-red-400" />}
                            <span className="text-sm font-bold text-gray-600">{post.likes?.length || 0}</span>
                        </button>
                        <div className="flex items-center gap-2">
                            <ChatBubbleLeftIcon className="w-6 h-6 text-gray-400" />
                            <span className="text-sm font-bold text-gray-600">{post.comments?.length || 0}</span>
                        </div>
                    </div>
                    
                    {isAuthor && (
                        <div className="flex gap-3">
                            <button onClick={(e) => { e.stopPropagation(); navigate(`/edit-post/${post._id || post.id}`); }} className="p-2 bg-blue-50 hover:bg-blue-100 rounded-full transition"><PencilSquareIcon className="w-5 h-5 text-blue-600" /></button>
                            <button onClick={handleDelete} className="p-2 bg-red-50 hover:bg-red-100 rounded-full transition"><TrashIcon className="w-5 h-5 text-red-600" /></button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

/* --- FullPostModal Component --- */
const FullPostModal = ({ post, user, onClose, onRefresh }) => {
    const [commentText, setCommentText] = useState("");
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editText, setEditText] = useState("");
    
    const comments = post.comments || [];
    const currentUserId = user?.id || user?.userId || user?._id;

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;
        const loadId = toast.loading("Posting...");
        try {
            const response = await addCommentApi(post._id || post.id, {
                text: commentText,
                user: user?.username || user?.firstName || "Anonymous",
                userId: currentUserId
            });
            if (response.data.success) {
                toast.success("Commented!", { id: loadId });
                setCommentText("");
                onRefresh();
            }
        } catch (err) { toast.error("Failed to post.", { id: loadId }); }
    };

    const handleUpdateComment = async (commentId) => {
        if (!editText.trim()) return;
        const loadId = toast.loading("Updating...");
        try {
            const response = await updateCommentApi(post._id || post.id, commentId, {
                text: editText,
                userId: currentUserId 
            });
            if (response.data.success) {
                toast.success("Updated!", { id: loadId });
                setEditingCommentId(null);
                onRefresh();
            }
        } catch (err) {
            toast.error("Update failed.", { id: loadId });
        }
    };

    const handleDeleteComment = (commentId) => {
        toast((t) => (
            <div className="flex flex-col gap-2">
                <span className="text-sm font-medium text-white">Delete this comment?</span>
                <div className="flex gap-2">
                    <button
                        onClick={async () => {
                            toast.dismiss(t.id);
                            const loadId = toast.loading("Removing...");
                            try {
                                const response = await deleteCommentApi(post._id || post.id, commentId, currentUserId);
                                if (response.data.success) {
                                    toast.success("Comment deleted!", { id: loadId });
                                    onRefresh();
                                }
                            } catch (err) {
                                toast.error("Failed to delete.", { id: loadId });
                            }
                        }}
                        className="bg-red-500 text-white px-3 py-1 rounded-md text-xs font-bold hover:bg-red-600"
                    >
                        Delete
                    </button>
                    <button onClick={() => toast.dismiss(t.id)} className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-xs font-bold">Cancel</button>
                </div>
            </div>
        ), { style: { background: '#333' } });
    };

    const imageSrc = post.image?.startsWith('http') 
        ? post.image 
        : `${API_BASE_URL}/uploads/${post.image}`;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-white w-full max-w-5xl h-[90vh] rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row shadow-2xl relative">
                <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-white/90 rounded-full z-50 shadow-lg hover:rotate-90 transition duration-300">
                    <XMarkIcon className="w-6 h-6 text-gray-900" />
                </button>

                <div className="flex-1 overflow-y-auto border-r border-gray-100">
                    <img src={imageSrc} className="w-full h-80 object-cover" alt="Cover" />
                    <div className="p-10">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-12 h-12 bg-emerald-700 text-white rounded-full flex items-center justify-center font-bold text-lg">{post.author?.charAt(0)}</div>
                            <div>
                                <p className="font-bold text-gray-900 text-lg">{post.author}</p>
                                <p className="text-xs text-gray-400 uppercase tracking-widest">{new Date(post.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <h2 className="text-4xl font-extrabold mb-8 font-serif leading-tight">{post.title}</h2>
                        <p className="text-xl text-gray-700 leading-relaxed whitespace-pre-wrap font-serif">{post.snippet}</p>
                    </div>
                </div>

                <div className="w-full md:w-96 bg-gray-50 flex flex-col h-full">
                    <div className="p-6 border-b border-gray-200 bg-white font-bold">Discussion ({comments.length})</div>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        {comments.length > 0 ? comments.map((c) => {
                            const isCommentOwner = String(c.userId) === String(currentUserId);
                            const isPostCreator = String(post.userId) === String(currentUserId);
                            return (
                                <div key={c.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 group">
                                    <div className="flex justify-between items-center mb-1">
                                        <p className="text-xs font-bold text-emerald-700">@{c.user}</p>
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {isCommentOwner && editingCommentId !== c.id && (
                                                <button onClick={() => { setEditingCommentId(c.id); setEditText(c.text); }} className="text-[10px] text-blue-500 hover:text-blue-700 font-bold">Edit</button>
                                            )}
                                            {(isCommentOwner || isPostCreator) && (
                                                <button onClick={() => handleDeleteComment(c.id)} className="text-[10px] text-red-500 hover:text-red-700 font-bold">Delete</button>
                                            )}
                                        </div>
                                    </div>
                                    {editingCommentId === c.id ? (
                                        <div className="space-y-2 mt-2">
                                            <textarea className="w-full text-sm p-2 border border-emerald-100 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" value={editText} onChange={(e) => setEditText(e.target.value)} rows="2" />
                                            <div className="flex gap-2">
                                                <button onClick={() => handleUpdateComment(c.id)} className="text-[10px] bg-emerald-600 text-white px-3 py-1 rounded-full font-bold hover:bg-emerald-700">Save</button>
                                                <button onClick={() => setEditingCommentId(null)} className="text-[10px] bg-gray-200 text-gray-600 px-3 py-1 rounded-full font-bold hover:bg-gray-300">Cancel</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-700 leading-snug">{c.text}</p>
                                    )}
                                </div>
                            );
                        }) : (
                            <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                                <ChatBubbleLeftIcon className="w-8 h-8 mb-2 opacity-20" />
                                <p className="text-sm">Be the first to comment!</p>
                            </div>
                        )}
                    </div>
                    <div className="p-4 bg-white border-t border-gray-200">
                        <form onSubmit={handleCommentSubmit} className="relative">
                            <input type="text" value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="Add a comment..." className="w-full py-3 px-4 pr-12 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                            <button type="submit" className="absolute right-2 top-1.5 p-1.5 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition"><PaperAirplaneIcon className="w-4 h-4" /></button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeedPage;