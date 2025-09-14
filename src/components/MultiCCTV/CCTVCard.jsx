import { useState } from 'react';

const CCTVCard = ({ camera, isBookmarked, onBookmark }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    const handleIframeLoad = () => {
        setIsLoading(false);
    };

    const handleIframeError = () => {
        setIsLoading(false);
        setHasError(true);
    };

    return (
        <div className="cctv-card">
            <div className="video-container">
                {isLoading && (
                    <div className="loading-overlay">
                        <span>Loading camera feed...</span>
                    </div>
                )}

                {hasError && (
                    <div className="error-overlay">
                        <span>Failed to load camera feed</span>
                    </div>
                )}

                <iframe
                    className="video-frame"
                    src={camera.IP_address}
                    frameBorder="0"
                    allow="autoplay"
                    title={camera.Camera_name}
                    onLoad={handleIframeLoad}
                    onError={handleIframeError}
                />
            </div>

            <div className="card-info">
                <div className="info-row">
                    <div>
                        <div className="project-name">{camera.Project_name}</div>
                        <div className="camera-name">{camera.Camera_name}</div>
                    </div>
                    <button
                        className={`bookmark-btn ${isBookmarked ? 'active' : ''}`}
                        onClick={onBookmark}
                    >
                        {isBookmarked ? 'Bookmarked' : 'Bookmark'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CCTVCard;