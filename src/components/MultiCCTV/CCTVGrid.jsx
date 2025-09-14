import { useState } from 'react';
import CCTVCard from './CCTVCard';

const CCTVGrid = ({ cameras, bookmarkedItems, onBookmark }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const camerasPerPage = 8; // 4x2 grid

  // Get current cameras
  const indexOfLastCamera = currentPage * camerasPerPage;
  const indexOfFirstCamera = indexOfLastCamera - camerasPerPage;
  const currentCameras = cameras.slice(indexOfFirstCamera, indexOfLastCamera);

  // Calculate total pages
  const totalPages = Math.ceil(cameras.length / camerasPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <div className="cctv-grid">
        {currentCameras.map((camera) => (
          <CCTVCard
            key={`${camera.Project_name}-${camera.Camera_name}`}
            camera={camera}
            isBookmarked={bookmarkedItems.some(
              item => 
                item.Camera_name === camera.Camera_name && 
                item.Project_name === camera.Project_name
            )}
            onBookmark={() => onBookmark(camera)}
          />
        ))}
        {/* Fill empty slots with placeholder cards if needed */}
        {Array(8 - currentCameras.length).fill(0).map((_, index) => (
          <div key={`empty-${index}`} className="cctv-card empty" />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="page-btn"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            &lt;&lt;
          </button>
          <span className="page-number">
            {currentPage} / {totalPages}
          </span>
          <button
            className="page-btn"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            &gt;&gt;
          </button>
        </div>
      )}
    </>
  );
};

export default CCTVGrid;