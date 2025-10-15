import SkeletonCard from "./SkeletonCard.jsx";

export default function SkeletonGrid() {
    return (
        <>
            <div className="text-4xl text-center">
             Backend Waking UP....
             <div className="loading-spinner text-5xl"></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">

                {Array.from({ length: 8 }).map((_, i) => (
                    <SkeletonCard key={i} />
                ))}
            </div>
        </>
    );
}