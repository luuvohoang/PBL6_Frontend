// File: src/components/MultiCCTV/CCTVCard.jsx
import React from 'react';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder'; // Icon (ví dụ)
import BookmarkIcon from '@mui/icons-material/Bookmark'; // Icon (ví dụ)

/**
 * Hàm trợ giúp (helper) để chuyển đổi link YouTube
 */
const convertYouTubeUrlToEmbed = (url) => {
  if (!url) return '';
  let videoId = '';
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname === 'youtu.be') {
      videoId = urlObj.pathname.substring(1);
    } else if (urlObj.hostname.includes('youtube.com')) {
      videoId = urlObj.searchParams.get('v');
    }
    if (videoId) {
      // Thêm ?autoplay=1&mute=1 để video tự chạy và tắt tiếng (quan trọng)
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`;
    }
  } catch (error) {
    console.error("Link YouTube không hợp lệ:", url, error);
    return '';
  }
  return url; // Trả về gốc nếu không phân tích được
};


const CCTVCard = ({ camera, isBookmarked, onBookmark }) => {
  
  // SỬA LỖI 3: Chuyển đổi link 'rtspUrl' (link YouTube) sang link Embed
  const videoEmbedUrl = convertYouTubeUrlToEmbed(camera.rtspUrl);

  return (
    <div className="cctv-card">
      
      {/* 1. Phần Video (Iframe) */}
      <div className="cctv-video-container">
        {videoEmbedUrl ? (
          <iframe
            src={videoEmbedUrl}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            title={camera.name}
          />
        ) : (
          <div className="video-placeholder">Link YouTube không hợp lệ</div>
        )}
      </div>

      {/* 2. Phần Thông tin */}
      <div className="cctv-info">
        <div className="cctv-details">
          {/* SỬA LỖI 4: Dùng 'camera.name' (tên trường đúng) */}
          <span className="camera-name">{camera.name}</span>
          {/* SỬA LỖI 5: Dùng 'camera.location' (tên trường đúng) */}
          <span className="camera-location">{camera.location}</span>
        </div>
        
        {/* 3. Nút Bookmark */}
        <button className="bookmark-btn" onClick={onBookmark}>
          {isBookmarked ? 
            <BookmarkIcon style={{ color: '#ffc107' }} /> : 
            <BookmarkBorderIcon />
          }
        </button>
      </div>
    </div>
  );
};

export default CCTVCard;