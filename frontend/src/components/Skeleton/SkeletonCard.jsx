// components/SkeletonCard.jsx
export default function SkeletonCard() {
  return (
    <div className="card bg-base-200 shadow-md animate-pulse">
      <div className="skeleton h-48 w-full rounded-t-xl"></div>
      <div className="card-body space-y-2">
        <div className="skeleton h-4 w-3/4"></div>
        <div className="skeleton h-4 w-1/2"></div>
      </div>
    </div>
  );
}
