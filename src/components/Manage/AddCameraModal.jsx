import { useState, useEffect } from 'react';

/**
 * Component này giờ nhận thêm prop 'projects'
 * (Manage.jsx đã được sửa để truyền prop này vào)
 */
const AddCameraModal = ({ onClose, onAdd, projects }) => {
  
  // Sửa: Tên trường (field) phải khớp với CameraCreationRequest DTO
  const [formData, setFormData] = useState({
    name: '',
    ipAddress: '',
    rtspUrl: '', // Thêm (đây là link YouTube)
    location: '',  // Thêm
    description: '', // Thêm
    model: ''        // Thêm
  });

  // Thêm: State để lưu projectId đang được chọn
  const [selectedProjectId, setSelectedProjectId] = useState('');

  // Thêm: Tự động chọn dự án đầu tiên khi modal mở
  useEffect(() => {
    if (projects && projects.length > 0) {
      setSelectedProjectId(projects[0].id);
    }
  }, [projects]);


  const handleSubmit = (e) => {
    e.preventDefault();
    // Sửa: Gọi onAdd với 2 tham số (projectId, cameraData)
    // (Manage.jsx đang mong đợi 2 tham số này)
    onAdd(selectedProjectId, formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Nếu không có dự án nào, không cho phép thêm
  if (!projects || projects.length === 0) {
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-header">
            <h2>Lỗi</h2>
            <button className="close-btn" onClick={onClose}>&times;</button>
          </div>
          <p>Bạn phải tạo một Dự án (Project) trước khi thêm Camera.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Add New Camera</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        
        <form onSubmit={handleSubmit}>

          {/* THÊM MỚI: Dropdown chọn Project (BẮT BUỘC) */}
          <div className="form-group">
            <label htmlFor="projectId">Project:</label>
            <select
              id="projectId"
              name="projectId"
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              required
            >
              {projects.map(project => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sửa: Tên trường (name, value) khớp với DTO (name) */}
          <div className="form-group">
            <label htmlFor="name">Camera Name:</label>
            <input
              type="text"
              id="name"
              name="name" 
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Sửa: Tên trường (name, value) khớp với DTO (ipAddress) */}
          <div className="form-group">
            <label htmlFor="ipAddress">IP Address:</label>
            <input
              type="text"
              id="ipAddress"
              name="ipAddress"
              value={formData.ipAddress}
              onChange={handleChange}
              required
            />
          </div>

          {/* Thêm: Trường rtspUrl */}
          <div className="form-group">
            <label htmlFor="rtspUrl">YouTube URL (thay cho RTSP):</label>
            <input
              type="text"
              id="rtspUrl"
              name="rtspUrl"
              value={formData.rtspUrl}
              onChange={handleChange}
              required
            />
          </div>

          {/* Thêm: Trường location */}
          <div className="form-group">
            <label htmlFor="location">Location:</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
            />
          </div>
          
          {/* Thêm: Trường description */}
          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <input
              type="text"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          {/* Thêm: Trường model */}
          <div className="form-group">
            <label htmlFor="model">Model:</label>
            <input
              type="text"
              id="model"
              name="model"
              value={formData.model}
              onChange={handleChange}
            />
          </div>

          {/* Xóa: Trường 'status' (không tồn tại trong DTO) */}
          
          <div className="modal-actions">
            <button type="submit">Save</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCameraModal;