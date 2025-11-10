import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const EditProjectModal = ({ project, managers, onClose, onUpdate, currentUser }) => {
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    managerId: ''
  });

  const [isAdmin, setIsAdmin] = useState(false);

  // Kiểm tra role khi component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const authorities = decoded.scope || decoded.roles || [];
        setIsAdmin(authorities.includes('ADMIN') || authorities.includes('ROLE_ADMIN'));
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, []);

  // Khởi tạo form data khi project thay đổi
  useEffect(() => {
    if (project) {
      console.log('Initializing with project:', project);
      setFormData({
        name: project.name || '',
        description: project.description || '',
        managerId: project.manager ? project.manager.id.toString() : ''
      });
    }
  }, [project]);

  const handleChange = (e) => {
    // Nếu không phải admin, không cho phép thay đổi managerId
    if (!isAdmin && e.target.name === 'managerId') {
      return;
    }
    
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    console.log('Submitting form with data:', formData);

    // Chuẩn bị dữ liệu theo API
    const projectData = {
      name: formData.name,
      description: formData.description
    };

    // Chỉ ADMIN mới được gửi managerId để thay đổi manager
    if (isAdmin && formData.managerId) {
      projectData.managerId = (formData.managerId);
    }

    console.log('Sending project data:', projectData);
    onUpdate(projectData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Edit Project</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Project Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
            />
          </div>

          {/* Hiển thị thông tin manager hiện tại */}
          <div className="form-group">
            <label>Current Manager:</label>
            <div className="current-manager-display">
              {project?.manager ? (
                <>
                  <strong>{project.manager.name}</strong> ({project.manager.email})
                </>
              ) : (
                'No manager assigned'
              )}
            </div>
          </div>

          {/* Chỉ ADMIN mới được thay đổi manager */}
          {isAdmin && (
            <div className="form-group">
              <label htmlFor="managerId">Change Manager:</label>
              <select
                id="managerId"
                name="managerId"
                value={formData.managerId}
                onChange={handleChange}
              >
                <option value="">Keep current manager</option>
                {managers && managers.length > 0 ? (
                  managers.map(manager => (
                    <option key={manager.id} value={manager.id}>
                      {manager.name} ({manager.email})
                    </option>
                  ))
                ) : (
                  <option value="" disabled>No managers available</option>
                )}
              </select>
              <small className="form-help">
                Only ADMIN can change project manager
              </small>
            </div>
          )}

          {/* Thông báo cho MANAGER */}
          {!isAdmin && (
            <div className="info-message">
              <p><strong>Note:</strong> You can only edit project name and description. Contact ADMIN to change project manager.</p>
            </div>
          )}

          <div className="modal-actions">
            <button type="submit">Update Project</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProjectModal;