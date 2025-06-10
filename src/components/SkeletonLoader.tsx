import React from "react";

interface SkeletonLoaderProps {
  variant?: "card" | "details" | "list" | "text";
  count?: number;
  className?: string;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  variant = "card",
  count = 1,
  className = "",
}) => {
  const renderSkeletonCard = () => (
    <div className="skeleton-card">
      <div className="skeleton-poster"></div>
      <div className="skeleton-info">
        <div className="skeleton-title"></div>
        <div className="skeleton-year"></div>
      </div>
    </div>
  );

  const renderSkeletonDetails = () => (
    <div className="skeleton-details">
      <div className="skeleton-details-poster"></div>
      <div className="skeleton-details-info">
        <div className="skeleton-details-title"></div>
        <div className="skeleton-details-meta"></div>
        <div className="skeleton-details-genres">
          <div className="skeleton-genre"></div>
          <div className="skeleton-genre"></div>
          <div className="skeleton-genre"></div>
        </div>
        <div className="skeleton-details-section">
          <div className="skeleton-details-heading"></div>
          <div className="skeleton-details-text"></div>
          <div className="skeleton-details-text"></div>
          <div className="skeleton-details-text"></div>
        </div>
        <div className="skeleton-details-section">
          <div className="skeleton-details-heading"></div>
          <div className="skeleton-details-text short"></div>
        </div>
      </div>
    </div>
  );

  const renderSkeletonList = () => (
    <div className="skeleton-list">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="skeleton-list-item">
          <div className="skeleton-list-poster"></div>
          <div className="skeleton-list-info">
            <div className="skeleton-list-title"></div>
            <div className="skeleton-list-meta"></div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderSkeletonText = () => (
    <div className="skeleton-text-container">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="skeleton-text-line"></div>
      ))}
    </div>
  );

  const renderSkeleton = () => {
    switch (variant) {
      case "card":
        return Array.from({ length: count }, (_, index) => (
          <div key={index}>{renderSkeletonCard()}</div>
        ));
      case "details":
        return renderSkeletonDetails();
      case "list":
        return renderSkeletonList();
      case "text":
        return renderSkeletonText();
      default:
        return renderSkeletonCard();
    }
  };

  return (
    <div className={`skeleton-loader ${className}`}>{renderSkeleton()}</div>
  );
};

export default SkeletonLoader;
