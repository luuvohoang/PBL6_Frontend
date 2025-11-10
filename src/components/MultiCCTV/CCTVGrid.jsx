import { useState } from 'react';
import CCTVCard from './CCTVCard'; // File này chúng ta sẽ sửa ở bước 2

const CCTVGrid = ({ cameras, bookmarkedItems, onBookmark }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const camerasPerPage = 8; // 4x2 grid

  const indexOfLastCamera = currentPage * camerasPerPage;
  const indexOfFirstCamera = indexOfLastCamera - camerasPerPage;
  const currentCameras = cameras.slice(indexOfFirstCamera, indexOfLastCamera);

  const totalPages = Math.ceil(cameras.length / camerasPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <div className="cctv-grid">
        {currentCameras.map((camera) => (
          <CCTVCard
            // SỬA LỖI 1: 'key' phải là một giá trị duy nhất như 'camera.id'
            key={camera.id}
            camera={camera}
            // SỬA LỖI 2: Logic bookmark phải so sánh 'id'
            isBookmarked={bookmarkedItems.some(
              item => item.id === camera.id
            )}
            onBookmark={() => onBookmark(camera)}
          />
        ))}
        {/* Fill empty slots */}
        {Array(8 - currentCameras.length).fill(0).map((_, index) => (
          <div key={`empty-${index}`} className="cctv-card empty" />
        ))}
      </div>

      {/* Pagination (Giữ nguyên) */}
      {totalPages > 1 && (
        <div className="pagination">
           {/* ... (code pagination của bạn) ... */}
        </div>
      )}
    </>
  );
};

export default CCTVGrid;