import { useState, useEffect } from 'react';
import Sidebar from '../components/MultiCCTV/Sidebar';
import CCTVGrid from '../components/MultiCCTV/CCTVGrid';
import '../assets/styles/multi_cctv.css';

const MultiCCTV = () => {
  const [cameras, setCameras] = useState([]);
  const [activeSection, setActiveSection] = useState('cctv-view-all');
  const [bookmarkedItems, setBookmarkedItems] = useState([]);
  const [filteredCameras, setFilteredCameras] = useState([]);

  useEffect(() => {
    fetchCameras();
  }, []);

  useEffect(() => {
    filterCameras(activeSection);
  }, [activeSection, cameras]);

  const fetchCameras = async () => {
    try {
      const response = await fetch('http://localhost:8081/api/cameras');
      const data = await response.json();
      setCameras(data);
    } catch (error) {
      console.error('Error fetching cameras:', error);
    }
  };

  const filterCameras = (section) => {
    switch (section) {
      case 'cctv-view-all':
        setFilteredCameras(cameras);
        break;
      case 'site-A':
        setFilteredCameras(cameras.filter(cam => cam.Project_name === 'SiteA'));
        break;
      case 'site-B':
        setFilteredCameras(cameras.filter(cam => cam.Project_name === 'SiteB'));
        break;
      case 'underground-vertical-zone':
        setFilteredCameras(cameras.filter(cam => cam.Project_name === 'Underground'));
        break;
      case 'show-bookmark':
        setFilteredCameras(bookmarkedItems);
        break;
      default:
        setFilteredCameras([]);
    }
  };

  const handleBookmark = (camera) => {
    setBookmarkedItems(prev => {
      const exists = prev.find(item => 
        item.Camera_name === camera.Camera_name && 
        item.Project_name === camera.Project_name
      );

      if (exists) {
        return prev.filter(item => 
          item.Camera_name !== camera.Camera_name || 
          item.Project_name !== camera.Project_name
        );
      }
      
      return [...prev, camera];
    });
  };

  return (
    <div className="multicctv-page">
      <Sidebar 
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />
      
      <div className="main-content-multi-cctv">
        <div className="content-header">
          <h1>{getSectionTitle(activeSection)}</h1>
        </div>
        
        <CCTVGrid 
          cameras={filteredCameras}
          bookmarkedItems={bookmarkedItems}
          onBookmark={handleBookmark}
        />
      </div>
    </div>
  );
};

const getSectionTitle = (section) => {
  switch (section) {
    case 'cctv-view-all': return 'CCTV View All';
    case 'site-A': return 'SITE-A';
    case 'site-B': return 'SITE-B';
    case 'underground-vertical-zone': return 'Underground Vertical Zone';
    case 'show-bookmark': return 'Show Bookmark';
    default: return '';
  }
};

export default MultiCCTV;