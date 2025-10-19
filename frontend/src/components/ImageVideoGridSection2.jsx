// --- Imports --- 
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { AssetCard } from '../components/AssetCard.jsx';
import useUserStore from '../zustand/user.store';
import { useTrail, animated } from "@react-spring/web"
import SkeletonGrid from './Skeleton/SkeletonGrid.jsx';
import { api } from '../utils/axiosInstance.js';
//-----------------------


// --- Initial Assets ---
const initialAssets = [
    // { id: 12, type: 'image', title: 'Tropical Sunset', url: 'https://images.pexels.com/photos/36717/amazing-animal-beautiful-beautifull.jpg', tags: ['nature', 'beach'] },
    // { id: 22, type: 'design', title: 'Marketing Poster', url: 'https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg', tags: ['business', 'promo'] },
    // { id: 32, type: 'image', title: 'Mountain Landscape', url: 'https://images.pexels.com/photos/371633/pexels-photo-371633.jpeg', tags: ['nature', 'mountains'] },
    // { id: 42, type: 'image', title: 'City at Night', url: 'https://images.pexels.com/photos/531880/pexels-photo-531880.jpeg', tags: ['cityscape', 'urban'] },
    // { id: 52, type: 'design', title: 'Social Media Post', url: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg', tags: ['social', 'template'] },
    // { id: 62, type: 'image', title: 'Forest Path', url: 'https://images.pexels.com/photos/775201/pexels-photo-775201.jpeg', tags: ['nature', 'forest'] },
    // { id: 72, type: 'design', title: 'Brand Logo Concepts', url: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg', tags: ['branding', 'logo'] },
    // { id: 82, type: 'image', title: 'Abstract Art', url: 'https://images.pexels.com/photos/1269968/pexels-photo-1269968.jpeg', tags: ['art', 'abstract'] },
    // { id: 92, type: 'image', title: 'Beach Sunset', url: 'https://images.pexels.com/photos/247322/pexels-photo-247322.jpeg', tags: ['nature', 'beach'] },
    // { id: 120, type: 'image', title: 'Urban Park', url: 'https://images.pexels.com/photos/34148016/pexels-photo-34148016.jpeg', tags: ['cityscape', 'park'] },
    // { id: 121, type: 'image', title: 'Mountain Lake', url: 'https://images.pexels.com/photos/2286895/pexels-photo-2286895.jpeg', tags: ['nature', 'lake'] },
    // { id: 122, type: 'image', title: 'City Skyline', url: 'https://images.pexels.com/photos/33435614/pexels-photo-33435614.jpeg', tags: ['cityscape', 'skyline'] },
    // { id: 123, type: 'image', title: 'Autumn Leaves', url: 'https://images.pexels.com/photos/33435615/pexels-photo-33435615.jpeg', tags: ['nature', 'autumn'] },
    // { id: 124, type: 'design', title: 'Business Presentation', url: 'https://images.pexels.com/photos/34079357/pexels-photo-34079357.jpeg', tags: ['business', 'presentation'] },
    // { id: 125, type: 'design', title: 'Flyer Design', url: 'https://images.pexels.com/photos/33435617/pexels-photo-33435617.jpeg', tags: ['marketing', 'flyer'] },
    // { id: 126, type: 'design', title: 'Email Newsletter', url: 'https://images.pexels.com/photos/7583935/pexels-photo-7583935.jpeg', tags: ['email', 'newsletter'] },
    // { id: 127, type: 'design', title: 'Product Mockup', url: 'https://images.pexels.com/photos/33435619/pexels-photo-33435619.jpeg', tags: ['product', 'mockup'] },
    // { id: 128, type: 'design', title: 'Event Invitation', url: 'https://images.pexels.com/photos/33435620/pexels-photo-33435620.jpeg', tags: ['event', 'invitation'] },
    // { id: 129, type: 'image', title: 'Desert Dunes', url: 'https://images.pexels.com/photos/29708644/pexels-photo-29708644.jpeg', tags: ['nature', 'desert'] },
    // { id: 220, type: 'image', title: 'Night Sky Stars', url: 'https://images.pexels.com/photos/33435622/pexels-photo-33435622.jpeg', tags: ['nature', 'night', 'stars'] }
];
//-----------------------


// --- Constants for pagination ---
const ITEMS_PER_PAGE = 8;

// --- DashBoard App --- 
export const ImageVideoGridSection = () => {

    // --- State Management ----
    const [allAssets, setAllAssets] = useState(initialAssets);
    const [displayAssets, setDisplayAssets] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [filter, setFilter] = useState('all');
    const userId = useUserStore((state) => state.user?._id);
    const [isLoading, setLoading] = useState(true);
    // --- Fetch Media from backend ---
    const fetchMedia = async () => {
        setLoading(true);
        try {
            const res = await api.get(`api/image/Images`)
            const data =  res.data
            console.log("Fetched media data: ", data);

            if (!data) {
                setLoading(true);
            }
            // Append new media, ensuring no duplicates from initialAssets or previous fetches
            setAllAssets(prevAssets => {
                const existingIds = new Set(prevAssets.map(a => a._id || `initial-${a.id}`));
                const newItems = data.filter(item => !existingIds.has(item._id));
                setLoading(false);
                return [...prevAssets, ...newItems];

            });

        } catch (error) {
            console.error('Error fetching media:', error);
            setLoading(true);
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        fetchMedia();
    }, []);

    // --- Memoized Filtering Logic ---
    // This recalculates only when the full asset list or the filter changes.
    const filteredAssets = useMemo(() => {
        if (filter === 'all') {
            return allAssets;
        }
        return allAssets.filter(asset => asset.type === filter);
    }, [allAssets, filter]);

    // --- Effect for Updating Display Assets on Filter Change ---
    // This resets the pagination and displayed items when a new filter is applied.
    useEffect(() => {
        const newDisplayAssets = filteredAssets.slice(0, ITEMS_PER_PAGE);
        setDisplayAssets(newDisplayAssets);
        setHasMore(filteredAssets.length > ITEMS_PER_PAGE);
    }, [filteredAssets]);

    // --- Lazy load more assets ---
    const fetchMoreAssets = () => {
        if (displayAssets.length >= filteredAssets.length) {
            setHasMore(false);
            return;
        }

        // Use a timeout to simulate network latency for a smoother loading feel
        setTimeout(() => {
            const nextAssets = filteredAssets.slice(displayAssets.length, displayAssets.length + ITEMS_PER_PAGE);
            setDisplayAssets(prevAssets => [...prevAssets, ...nextAssets]);
        }, 500);
    };

    // --- Animation Trail ---
    const trail = useTrail(displayAssets.length, {
        from: { opacity: 0, transform: 'translateY(20px)' },
        to: { opacity: 1, transform: 'translateY(0px)' },
        config: { mass: 1, tension: 200, friction: 20 },
    });

    return (
        <section className="py-12 md:py-20 px-4 md:px-8 relative z-20 bg-black">
            <div className="max-w-7xl mx-auto">
                {/* Filter Buttons */}
                <div className="flex justify-center items-center flex-wrap gap-4 mb-10">
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
                    {/* Added a 'Design' button to match your initial data */}
                    <button
                        onClick={() => setFilter('design')}
                        className={`btn btn-md ${filter === 'design' ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black' : 'btn-outline text-yellow-300 border-yellow-500 hover:bg-yellow-500/20 hover:border-yellow-400'} hover:scale-105 transition-all duration-200`}
                    >
                        Designs
                    </button>
                    <button
                        onClick={() => setFilter('video')}
                        className={`btn btn-md ${filter === 'video' ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black' : 'btn-outline text-yellow-300 border-yellow-500 hover:bg-yellow-500/20 hover:border-yellow-400'} hover:scale-105 transition-all duration-200`}
                    >
                        Videos
                    </button>
                </div>
                {isLoading ? 
                    <SkeletonGrid /> 
                    : 
                    <InfiniteScroll
                        dataLength={displayAssets.length}
                        next={fetchMoreAssets}
                        hasMore={hasMore}
                        loader={<h4 className="text-center text-yellow-400 py-8 col-span-full">Loading More...</h4>}
                        endMessage={<p className="text-center text-gray-400 py-8 col-span-full"><b>All assets loaded</b></p>}
                    >
                        {/* MASONRY LAYOUT: Using CSS columns for a compact, gap-free grid */}
                        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 2xl:columns-5 gap-6">
                            {trail.map((style, index) => {
                                const asset = displayAssets[index];
                                return (
                                    <animated.div
                                        style={style}
                                        key={asset._id || `initial-${asset.id}`}
                                        // This class prevents an item from breaking across two columns
                                        className="break-inside-avoid mb-6"
                                    >
                                        <AssetCard
                                            isCommunity={true}
                                            asset={asset}
                                        />
                                    </animated.div>
                                );
                            })}
                        </div>
                    </InfiniteScroll>
                }

            </div>
        </section>
    );
};