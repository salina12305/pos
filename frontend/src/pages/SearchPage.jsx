import React, { useState, useEffect } from 'react';
import { getPublishedPostsApi } from '../services/api';
import Navbar from './components/Navbar';
import { MagnifyingGlassIcon, UserIcon, BookOpenIcon } from "@heroicons/react/24/outline";
import { useNavigate } from 'react-router-dom';

const SearchPage = () => {
    const navigate = useNavigate();
    const [allPosts, setAllPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await getPublishedPostsApi();
                if (response.data.success) {
                    setAllPosts(response.data.data);
                    setFilteredPosts(response.data.data); // Initial view shows all
                }
            } catch (err) {
                console.error("Search fetch error", err);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    // Filter Logic
    useEffect(() => {
        const results = allPosts.filter(post => 
            post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
            post.author.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredPosts(results);
    }, [searchQuery, allPosts]);

    return (
        <div className="min-h-screen bg-[#F8F9FA] font-sans">
            <Navbar />

            <main className="max-w-4xl mx-auto py-12 px-6">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">Explore Stories</h2>
                    <p className="text-gray-500">Search by story title or your favorite author</p>
                </div>

                {/* --- Search Input --- */}
                <div className="relative max-w-2xl mx-auto mb-16">
                    <MagnifyingGlassIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-emerald-600" />
                    <input 
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-14 pr-6 py-5 bg-white border-none rounded-3xl shadow-xl focus:ring-2 focus:ring-emerald-500 text-lg transition-all outline-none"
                    />
                </div>

                {/* --- Results --- */}
                {loading ? (
                    <div className="flex justify-center"><div className="animate-spin h-8 w-8 border-4 border-emerald-700 border-t-transparent rounded-full"></div></div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {filteredPosts.length > 0 ? (
                            filteredPosts.map(post => (
                                <div 
                                    key={post.id} 
                                    onClick={() => navigate(`/feedpage#post-${post.id}`)}
                                    className="bg-white p-6 rounded-[2rem] border border-gray-100 flex items-center justify-between hover:shadow-lg hover:border-emerald-200 transition cursor-pointer group"
                                >
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2 text-emerald-700 mb-1">
                                            <BookOpenIcon className="w-4 h-4" />
                                            <span className="text-[10px] font-bold uppercase tracking-widest">Story Title</span>
                                        </div>
                                        <h4 className="text-xl font-serif font-bold text-gray-800 group-hover:text-emerald-800 transition">
                                            {post.title}
                                        </h4>
                                        <div className="flex items-center gap-2 mt-2 text-gray-400">
                                            <UserIcon className="w-4 h-4" />
                                            <span className="text-sm font-medium">By {post.author}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="hidden sm:block">
                                        <button className="px-6 py-2 bg-emerald-50 text-emerald-700 rounded-full font-bold text-xs uppercase tracking-tighter group-hover:bg-emerald-700 group-hover:text-white transition">
                                            Read Story
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
                                <p className="text-gray-400 italic">No stories found matching "{searchQuery}"</p>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default SearchPage;