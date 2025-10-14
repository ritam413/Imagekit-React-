// --- Imports --- 
import React, { useState, useEffect, useCallback, useRef } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { AssetCard } from '../components/AssetCard.jsx';
import useUserStore from '../zustand/user.store';
//-----------------------


// --- Initial Assets ---
const initialAssets = [
    { id: 12, type: 'image', title: 'Tropical Sunset', url: 'https://images.pexels.com/photos/36717/amazing-animal-beautiful-beautifull.jpg', tags: ['nature', 'beach'] },
    { id: 22, type: 'design', title: 'Marketing Poster', url: 'https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg', tags: ['business', 'promo'] },
    { id: 32, type: 'image', title: 'Mountain Landscape', url: 'https://images.pexels.com/photos/371633/pexels-photo-371633.jpeg', tags: ['nature', 'mountains'] },
    { id: 42, type: 'image', title: 'City at Night', url: 'https://images.pexels.com/photos/531880/pexels-photo-531880.jpeg', tags: ['cityscape', 'urban'] },
    { id: 52, type: 'design', title: 'Social Media Post', url: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg', tags: ['social', 'template'] },
    { id: 62, type: 'image', title: 'Forest Path', url: 'https://images.pexels.com/photos/775201/pexels-photo-775201.jpeg', tags: ['nature', 'forest'] },
    { id: 72, type: 'design', title: 'Brand Logo Concepts', url: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg', tags: ['branding', 'logo'] },
    { id: 82, type: 'image', title: 'Abstract Art', url: 'https://images.pexels.com/photos/1269968/pexels-photo-1269968.jpeg', tags: ['art', 'abstract'] },
    { id: 92, type: 'image', title: 'Beach Sunset', url: 'https://images.pexels.com/photos/247322/pexels-photo-247322.jpeg', tags: ['nature', 'beach'] },
    { id: 120, type: 'image', title: 'Urban Park', url: 'https://images.pexels.com/photos/34148016/pexels-photo-34148016.jpeg', tags: ['cityscape', 'park'] },
    { id: 121, type: 'image', title: 'Mountain Lake', url: 'https://images.pexels.com/photos/2286895/pexels-photo-2286895.jpeg', tags: ['nature', 'lake'] },
    { id: 122, type: 'image', title: 'City Skyline', url: 'https://images.pexels.com/photos/33435614/pexels-photo-33435614.jpeg', tags: ['cityscape', 'skyline'] },
    { id: 123, type: 'image', title: 'Autumn Leaves', url: 'https://images.pexels.com/photos/33435615/pexels-photo-33435615.jpeg', tags: ['nature', 'autumn'] },
    { id: 124, type: 'design', title: 'Business Presentation', url: 'https://images.pexels.com/photos/34079357/pexels-photo-34079357.jpeg', tags: ['business', 'presentation'] },
    { id: 125, type: 'design', title: 'Flyer Design', url: 'https://images.pexels.com/photos/33435617/pexels-photo-33435617.jpeg', tags: ['marketing', 'flyer'] },
    { id: 126, type: 'design', title: 'Email Newsletter', url: 'https://images.pexels.com/photos/7583935/pexels-photo-7583935.jpeg', tags: ['email', 'newsletter'] },
    { id: 127, type: 'design', title: 'Product Mockup', url: 'https://images.pexels.com/photos/33435619/pexels-photo-33435619.jpeg', tags: ['product', 'mockup'] },
    { id: 128, type: 'design', title: 'Event Invitation', url: 'https://images.pexels.com/photos/33435620/pexels-photo-33435620.jpeg', tags: ['event', 'invitation'] },
    { id: 129, type: 'image', title: 'Desert Dunes', url: 'https://images.pexels.com/photos/29708644/pexels-photo-29708644.jpeg', tags: ['nature', 'desert'] },
    { id: 220, type: 'image', title: 'Night Sky Stars', url: 'https://images.pexels.com/photos/33435622/pexels-photo-33435622.jpeg', tags: ['nature', 'night', 'stars'] }
];
//-----------------------



// --- DashBoard App --- 
export const ImageVideoGridSection = () => {

    // --- Getting States ----
    const [assets, setAssets] = useState(initialAssets);
    const [displayAssets, setDisplayAssets] = useState(initialAssets.slice(0, 8)); // lazy load first 8
    const [hasMore, setHasMore] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [sidebarWidth, setSidebarWidth] = useState(256);
    const modalId = "upload_modal";
    const sidebarRef = useRef(null);
    const isResizing = useRef(false);
    const userId = useUserStore((state) => state.user?._id);
    const [filter, setFilter] = useState('all')

    // ----------------------


    // --- Fetch Media from backend ---
    const fetchMedia = async () => {
        try {
            const res = await fetch("http://localhost:8000/api/image/Images",
                {
                    method: "GET",
                    headers:
                    {
                        "Content-Type": "application/json",
                    },
                })
            const data = await res.json();

            console.log("data.media is : ","   data: " ,data);

            const media = data
            // Setting the fetched Assets AFter the initial asset Loads in 
            setAssets(prev => {
                const existingIds = new Set(prev.map(a => a._id || `initial-${a.id}`));
                const newItems = media.filter(a => !existingIds.has(a._id));
                return [...prev, ...newItems];
            });

        } catch (error) {
            console.error('Error fetching media:', error);
        }
    };

    useEffect(() => {
        fetchMedia();
    }, []);

    // --- Filtering ---
    useEffect(() => {
        let filtered = initialAssets;
        if (filterType !== 'all') filtered = filtered.filter(a => a.type === filterType);
        if (searchTerm) filtered = filtered.filter(a => a.title.toLowerCase().includes(searchTerm.toLowerCase()));

        setAssets(filtered);
        setDisplayAssets(filtered.slice(0, 9));
        setHasMore(filtered.length > 7);
    }, [searchTerm, filterType]);

    // --- Lazy load more assets ---
    const fetchMoreAssets = () => {
        if (displayAssets.length >= assets.length) {
            setHasMore(false);
            return;
        }
        setTimeout(() => {
            const nextAssets = assets.slice(displayAssets.length, displayAssets.length + 4);
            setDisplayAssets(prev => [...prev, ...nextAssets]);
        }, 300);
    };

    // --- Sidebar Resizing ---
    const handleMouseMove = useCallback((e) => {
        if (isResizing.current && sidebarRef.current) {
            let newWidth = e.clientX - sidebarRef.current.getBoundingClientRect().left;
            if (newWidth < 200) newWidth = 200;
            if (newWidth > 500) newWidth = 500;
            setSidebarWidth(newWidth);
        }
    }, []);

    const handleMouseUp = useCallback(() => {
        isResizing.current = false;
        document.body.style.cursor = 'default';
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
    }, [handleMouseMove]);

    const handleMouseDown = (e) => {
        e.preventDefault();
        isResizing.current = true;
        document.body.style.cursor = 'col-resize';
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    };
    const filteredItems = displayAssets.filter(media => filter === 'all' || media.type === filter);

    return (
        <section className="py-12 md:py-20 px-4 md:px-8 relative z-20 bg-black">
            <div className="max-w-7xl mx-auto">
                {/* Filter Buttons */}
                <div className="flex justify-center space-x-4 mb-10">
                    <button
                        onClick={() => setFilter('all')}
                        className={`btn btn-md ${filter === 'all' ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black' : 'btn-outline text-yellow-300 border-yellow-500 hover:bg-yellow-500/20 hover:border-yellow-400'} hover:scale-105 transition-all duration-200`}
                    >

                        All
                    </button>
                    <button
                        onClick={() => setFilter('image')}
                        className={`btn btn-md ${filter === 'image' ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black' : 'btn-outline text-yellow-300 border-yellow-500 hover:bg-yellow-500/20 hover:border-yellow-400'} hover:scale-105 transition-all duration-200`}
                    >
                        Images
                    </button>
                    <button
                        onClick={() => setFilter('video')}
                        className={`btn btn-md ${filter === 'video' ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black' : 'btn-outline text-yellow-300 border-yellow-500 hover:bg-yellow-500/20 hover:border-yellow-400'} hover:scale-105 transition-all duration-200`}
                    >
                        Videos
                    </button>
                </div>


                <InfiniteScroll
                    dataLength={displayAssets.length}
                    next={fetchMoreAssets}
                    hasMore={hasMore}
                    loader={<h4 className="text-center text-yellow-400 py-8">Loading More...</h4>}
                    endMessage={<p className="text-center text-gray-400 py-8"><b>All assets loaded</b></p>}
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                        {displayAssets.map((asset, index) => (
                            <AssetCard
                                isCommunity = {true}
                                key={asset._id || `initial-${asset.id}`}
                                asset={asset}
                               
                            />
                        ))}
                    </div>
                </InfiniteScroll>

            </div>
        </section>
    );
};

