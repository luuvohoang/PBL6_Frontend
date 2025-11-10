import React from 'react';
// (Bạn có thể thêm các icon SVG của mình vào đây)

// Icon cho "All CCTVs" (từ code cũ của bạn)
const AllIcon = () => (
  <svg className="svg-mutil_cctv" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
    <path d="M0 128C0 92.7 28.7 64 64 64H320c35.3 0 64 28.7 64 64V384c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128zM559.1 99.8c10.4 5.6 16.9 16.4 16.9 28.2V384c0 11.8-6.5 22.6-16.9 28.2s-23 5-32.9-1.6l-96-64L416 337.1V320 192 174.9l14.2-9.5 96-64c9.8-6.5 22.4-7.2 32.9-1.6z" />
  </svg>
);

// Icon cho "Projects" (Placeholder, bạn có thể thay thế)
const ProjectIcon = () => (
  <svg className="svg-mutil_cctv" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
    <path d="M0 96C0 60.7 28.7 32 64 32H448c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zM48 416c0 8.8 7.2 16 16 16H448c8.8 0 16-7.2 16-16V96c0-8.8-7.2-16-16-16H64c-8.8 0-16 7.2-16 16V416zM291.3 221.3l120 120c4.7 4.7 4.7 12.3 0 17l-22.6 22.6c-4.7 4.7-12.3 4.7-17 0L256 265.3l-55.7 55.7c-4.7 4.7-12.3 4.7-17 0L160.7 298c-4.7-4.7-4.7-12.3 0-17l120-120c4.7-4.7 12.3-4.7 17 0zM112 160c-17.7 0-32 14.3-32 32s14.3 32 32 32s32-14.3 32-32s-14.3-32-32-32z" />
  </svg>
);

// Icon cho "Bookmarks" (Placeholder, bạn có thể thay thế)
const BookmarkIcon = () => (
  <svg className="svg-mutil_cctv" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
    <path d="M0 48C0 21.5 21.5 0 48 0l0 48V441.4l130.1-92.9c8.3-5.9 19.6-5.9 27.9 0L336 441.4V48H48c-26.5 0-48 21.5-48 48V48z" />
  </svg>
);


/**
 * Sidebar MỚI
 * Nhận thêm prop 'projects' từ component cha
 */
const Sidebar = ({ activeSection, onSectionChange, projects }) => {

  return (
    <div className="sidebar-multicctv">
      <div className="item-title">MONITORING</div>
      <hr />

      {/* 1. Mục "Xem Tất cả" (Tĩnh) */}
      <div
        key="cctv-view-all"
        className={`sidebar-multicctv-item ${activeSection === 'cctv-view-all' ? 'active' : ''}`}
        onClick={() => onSectionChange('cctv-view-all')}
      >
        <div className="icon"><AllIcon /></div>
        <div className="title">All CCTVs</div>
      </div>

      {/* 2. Các Dự án (Động) */}
      {/* Lặp qua danh sách 'projects' và tạo mục (item) */}
      {projects && projects.map(project => (
        <div
          key={project.id}
          // So sánh 'activeSection' (là SỐ) với 'project.id' (là SỐ)
          className={`sidebar-multicctv-item ${activeSection === project.id ? 'active' : ''}`}
          // SỬA LỖI: Gửi đi 'project.id' (là SỐ), không còn là 'site-A'
          onClick={() => onSectionChange(project.id)} 
        >
          <div className="icon"><ProjectIcon /></div>
          <div className="title">{project.name}</div>
        </div>
      ))}

      <div className="item-title">SAVED</div>
      <hr />

      {/* 3. Mục "Đã đánh dấu" (Tĩnh) */}
      <div
        key="show-bookmark"
        className={`sidebar-multicctv-item ${activeSection === 'show-bookmark' ? 'active' : ''}`}
        onClick={() => onSectionChange('show-bookmark')}
      >
        <div className="icon"><BookmarkIcon /></div>
        <div className="title">Bookmarks</div>
      </div>
    </div>
  );
};

export default Sidebar;