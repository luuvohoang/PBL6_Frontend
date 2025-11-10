// File: src/components/History/SearchForm.jsx
import { useState } from 'react';
import DatePicker from 'react-datepicker'; // Bạn đã có thư viện này
import "react-datepicker/dist/react-datepicker.css";

const SearchForm = ({ 
  projects,       // Prop mới: Danh sách dự án
  cameras,        // Prop mới: Danh sách camera
  loadingCameras, // Prop mới: Trạng thái tải camera
  onProjectChange,  // Prop mới: Hàm gọi khi đổi dự án
  onSearch        // Prop cũ: Hàm gọi khi tìm kiếm
}) => {
  
  // --- State mới, khớp với AlertSearchRequest DTO ---
  const [projectId, setProjectId] = useState('');
  const [cameraId, setCameraId] = useState('');
  const [happenedAfter, setHappenedAfter] = useState(null); // 'fromDate' cũ
  const [happenedBefore, setHappenedBefore] = useState(null); // 'toDate' cũ
  const [type, setType] = useState('');
  const [severity, setSeverity] = useState('');
  const [status, setStatus] = useState('');

  // --- Hàm xử lý mới ---
  const handleProjectChange = (e) => {
    const newProjectId = e.target.value;
    setProjectId(newProjectId);
    setCameraId(''); // Reset ô chọn camera
    onProjectChange(newProjectId); // Báo cho History.jsx (cha) tải camera
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!projectId) {
      alert("Vui lòng chọn một Dự án (Project).");
      return;
    }
    
    // Gọi onSearch với object đầy đủ (History.jsx sẽ xử lý .toISOString())
    onSearch({
      projectId,
      cameraId: cameraId || null, // Gửi null nếu "Tất cả Camera"
      happenedAfter: happenedAfter,
      happenedBefore: happenedBefore,
      type: type || null,
      severity: severity || null,
      status: status || null
    });
  };

  return (
    <div className="box-searchs">
      <div className="item-title">
        <h3>Search Detection History</h3>
        <p>Retrieve alarms history based on detection period and location</p>
      </div>

      <form className="search-form" onSubmit={handleSubmit}>
        
        {/* SỬA: Lọc theo Project (Dự án) */}
        <div className="form-group">
          <label>Project (Dự án):</label>
          <select 
            value={projectId}
            onChange={handleProjectChange}
            required
          >
            <option value="">-- Chọn Dự án --</option>
            {projects.map(project => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>

        {/* SỬA: Lọc theo Camera (Kênh) */}
        <div className="form-group">
          <label>Camera (Kênh):</label>
          <select
            value={cameraId}
            onChange={(e) => setCameraId(e.target.value)}
            disabled={!projectId || loadingCameras} // Tắt khi đang tải
          >
            <option value="">-- Tất cả Camera --</option>
            {loadingCameras ? (
              <option>Đang tải...</option>
            ) : (
              cameras.map(camera => (
                <option key={camera.id} value={camera.id}>
                  {camera.name}
                </option>
              ))
            )}
          </select>
        </div>

        {/* Giữ nguyên Date Pickers (nhưng đổi state) */}
        <div className="form-group">
          <label>Từ ngày (From Date):</label>
          <DatePicker
            selected={happenedAfter}
            onChange={date => setHappenedAfter(date)}
            dateFormat="dd/MM/yyyy HH:mm"
            showTimeSelect
            placeholderText="Chọn ngày bắt đầu"
          />
        </div>

        <div className="form-group">
          <label>Đến ngày (To Date):</label>
          <DatePicker
            selected={happenedBefore}
            onChange={date => setHappenedBefore(date)}
            dateFormat="dd/MM/yyyy HH:mm"
            showTimeSelect
            placeholderText="Chọn ngày kết thúc"
            minDate={happenedAfter}
          />
        </div>

        {/* THÊM: Các bộ lọc (filters) mà backend hỗ trợ */}
        <div className="form-group">
          <label>Loại (Type):</label>
          <input 
            type="text" 
            value={type} 
            onChange={e => setType(e.target.value)}
            placeholder="e.g., NO_HELMET"
          />
        </div>
        
        <div className="form-group">
          <label>Mức độ (Severity):</label>
          <select value={severity} onChange={e => setSeverity(e.target.value)}>
            <option value="">-- Tất cả --</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>Trạng thái (Status):</label>
          <select value={status} onChange={e => setStatus(e.target.value)}>
            <option value="">-- Tất cả --</option>
            <option value="NEW">New</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="RESOLVED">Resolved</option>
            <option value="DISMISSED">Dismissed</option>
          </select>
        </div>

        <button type="submit" className="search-button">
          Search
        </button>
      </form>
    </div>
  );
};

export default SearchForm;