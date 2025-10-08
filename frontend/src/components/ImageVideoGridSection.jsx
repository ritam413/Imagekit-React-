import React, { useState, useEffect } from 'react';
import { IoPlayCircleOutline } from 'react-icons/io5'; // For video play icon
import InfiniteScroll from 'react-infinite-scroll-component'; // For infinite scroll

const dummyMedia = [
  { id: 1, type: 'image', originalUrl: 'https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'Portrait of a woman', tags: ['portrait'] },
  { id: 2, type: 'image', originalUrl: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'Man working', tags: ['portrait'] },
  { id: 3, type: 'image', originalUrl: 'https://images.pexels.com/photos/248280/pexels-photo-248280.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'Nature landscape', tags: ['landscape'] },
  { id: 4, type: 'image', originalUrl: 'https://images.pexels.com/photos/414612/pexels-photo-414612.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'Couple hiking', tags: ['travel'] },
  // { id: 5, type: 'video', originalUrl: 'https://www.pexels.com/video/29383815/download/', alt: 'Nature video', tags: ['video'] },
  { id: 6, type: 'image', src: 'https://images.pexels.com/photos/547114/pexels-photo-547114.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'Child playing', tags: ['child'] },
  { id: 7, type: 'image', src: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'Woman smiling', tags: ['portrait'] },
  // { id: 8, type: 'video', src: 'https://www.pexels.com/video/29383814/download/', alt: 'Cityscape video', tags: ['video'] },
  { id: 9, type: 'image', src: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'Man thinking', tags: ['portrait'] },
  { id: 10, type: 'image', src: 'https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'Smiling child', tags: ['child'] },
  { id: 11, type: 'image', src: 'https://images.pexels.com/photos/36717/amazing-animal-beautiful-beautifull.jpg?auto=compress&cs=tinysrgb&w=600', alt: 'Sunset landscape', tags: ['landscape'] },
  // { id: 12, type: 'video', src: 'https://www.pexels.com/video/29383813/download/', alt: 'Abstract video', tags: ['video'] },
  { id: 13, type: 'image', src: 'https://images.pexels.com/photos/3585046/pexels-photo-3585046.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'Man thinking', tags: ['portrait'] },
  { id: 14, type: 'image', src: 'https://images.pexels.com/photos/3985338/pexels-photo-3985338.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'Woman smiling', tags: ['portrait'] },
  // { id: 15, type: 'video', src: 'https://www.pexels.com/video/29383812/download/', alt: 'Dance video', tags: ['video'] },
  { id: 16, type: 'image', src: 'https://images.pexels.com/photos/2100063/pexels-photo-2100063.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'Urban street', tags: ['cityscape'] },
  { id: 17, type: 'image', src: 'https://images.pexels.com/photos/247322/pexels-photo-247322.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'Beach sunrise', tags: ['landscape'] },
  { id: 18, type: 'image', src: 'https://images.pexels.com/photos/3573359/pexels-photo-3573359.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'Mountain hike', tags: ['travel'] },
  // { id: 19, type: 'video', src: 'https://www.pexels.com/video/29383811/download/', alt: 'Forest video', tags: ['video'] },
  { id: 20, type: 'image', src: 'https://images.pexels.com/photos/733174/pexels-photo-733174.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'Woman portrait', tags: ['portrait'] },
  { id: 21, type: 'image', src: 'https://images.pexels.com/photos/1704488/pexels-photo-1704488.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'City skyline', tags: ['cityscape'] },
  // { id: 22, type: 'video', src: 'https://www.pexels.com/video/29383810/download/', alt: 'Time lapse video', tags: ['video'] },
  { id: 23, type: 'image', src: 'https://images.pexels.com/photos/356830/pexels-photo-356830.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'Forest view', tags: ['landscape'] },
  { id: 24, type: 'image', src: 'https://images.pexels.com/photos/462118/pexels-photo-462118.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'Street life', tags: ['cityscape'] },
  // { id: 25, type: 'video', src: 'https://www.pexels.com/video/29383809/download/', alt: 'Ocean waves', tags: ['video'] },
  { id: 26, type: 'image', src: 'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=600', alt: 'Desert dune', tags: ['landscape'] },
  { id: 27, type: 'image', src: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'Portrait man', tags: ['portrait'] },
  // { id: 28, type: 'video', src: 'https://www.pexels.com/video/29383808/download/', alt: 'Night city video', tags: ['video'] },
  { id: 29, type: 'image', src: 'https://images.pexels.com/photos/414171/pexels-photo-414171.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'Couple in park', tags: ['travel'] },
  // { id: 30, type: 'video', src: 'https://www.pexels.com/video/29383807/download/', alt: 'River video', tags: ['video'] },
];


const ImageVideoGridSection = () => {
  const [filter, setFilter] = useState('all'); // 'all', 'image', 'video'
  const [items, setItems] = useState(dummyMedia.slice(0, 8)); // Initial load
  const [hasMore, setHasMore] = useState(true);
  const [images, setImages] = useState([]);
  const [allmedia, setAllmedia] = useState(dummyMedia);
  useEffect(() => {
    const getImages = async () => {
      const res = await fetch("http://localhost:8000/api/image/Images",
        {
          method: "GET",
          headers:
          {
            "Content-Type": "application/json",
          },
        })
      const data = await res.json()

      const formatted = data.map((img, idx) => ({
        id: allmedia.length + idx + 1,
        type: "image", // or "video" if you can detect
        src: img.src || img.originalUrl, // ✅ ensure correct field
        alt: img.alt || "Fetched image",
        tags: img.tags || ["fetched"],
      }))

      setAllmedia(prev => {
        const updated =[...prev, ...formatted]
        // setImages(updated.slice(0, 8));
        return updated
      })

      // setImages(data)
      console.log("Response I got from Images : ", data)
    };

    getImages();

  }, []);

  const fetchMoreData = () => {
    if (items.length >= allmedia.length) {
      setHasMore(false);
      return;
    }
    // Simulate API call
    setTimeout(() => {
      setItems(prevItems => prevItems.concat(allmedia.slice(prevItems.length, prevItems.length + 4)));
    }, 700);
  };

  const filteredItems = allmedia.filter(media => filter === 'all' || media.type === filter);

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

        {/* Pinterest-style Grid with Infinite Scroll */}
        <InfiniteScroll
          dataLength={filteredItems.length}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={<h4 className="text-center text-yellow-400 py-8">Loading More...</h4>}
          endMessage={<p className="text-center text-gray-400 py-8"><b>Yay! You have seen it all</b></p>}
        >
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {filteredItems.map(media => (
              <div
                key={`${media.type}-${media.id}-${media.src}`}
                className="relative group overflow-hidden rounded-lg shadow-xl border border-yellow-500/50 hover:border-yellow-300 transition-all duration-300 ease-in-out break-inside-avoid"
              >
                {media.type === 'image' ? (
                  <img
                    src={(media.src)||(media.originalUrl)}
                    alt={media.alt}
                    className="w-full h-auto object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="relative bg-gray-900 flex items-center justify-center">
                    <video
                      src={(media.src)||(media.originalUrl)}
                      controls
                      className="w-full h-auto object-contain"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-all duration-300">
                      <IoPlayCircleOutline className="text-yellow-400 text-6xl opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 cursor-pointer" />
                    </div>
                  </div>
                )}

                {/* Overlay with tags */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <div className="flex flex-wrap gap-2">
                    {media.tags.map((tag, index) => (
                      <span
                        key={`${media.id}-${tag}-${index}`}
                        className="text-xs px-2 py-1 rounded-md bg-yellow-600/30 text-yellow-100 border border-yellow-500/40"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </InfiniteScroll>

      </div>
    </section>

  );
};

export default ImageVideoGridSection;