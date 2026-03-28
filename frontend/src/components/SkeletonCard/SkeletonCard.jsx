const SkeletonCard = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-36 sm:w-40',
    md: 'w-40 sm:w-48',
    lg: 'w-48 sm:w-56',
  };

  return (
    <div className={`${sizeClasses[size]} shrink-0`}>
      <div className="rounded-xl overflow-hidden bg-[var(--color-cinema-card)]">
        <div className="aspect-[2/3] skeleton" />
        <div className="p-2.5 space-y-2">
          <div className="skeleton h-3 rounded w-3/4" />
          <div className="skeleton h-2.5 rounded w-1/2" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
