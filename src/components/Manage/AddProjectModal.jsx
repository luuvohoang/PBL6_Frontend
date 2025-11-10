import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AddProjectModal = ({ onClose, onAdd, managers, currentUser }) => {
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    managerId: ''
  });

  const [isAdmin, setIsAdmin] = useState(false);

  // Kiểm tra role khi component mount
  useEffect(() => {
    const token = localStorage.getItem('token'); // hoặc cách bạn lấy token
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

  // Auto-set managerId cho MANAGER
  useEffect(() => {
    if (!isAdmin && currentUser) {
      setFormData(prev => ({
        ...prev,
        managerId: currentUser.id.toString()
      }));
    }
  }, [isAdmin, currentUser]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const projectData = {
      name: formData.name,
      description: formData.description,
      managerId: isAdmin ? (formData.managerId) : undefined
      // MANAGER không gửi managerId, backend sẽ auto-set
    };

    console.log('Sending project data:', projectData);
    onAdd(projectData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Add New Project</h2>
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
              placeholder="Enter project name"
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
              placeholder="Enter project description"
            />
          </div>

          {/* Chỉ hiển thị dropdown manager cho ADMIN */}
          {isAdmin && (
            <div className="form-group">
              <label htmlFor="managerId">Project Manager:</label>
              <select
                id="managerId"
                name="managerId"
                value={formData.managerId}
                onChange={handleChange}
                required
              >
                <option value="">Select a manager</option>
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
            </div>
          )}

          {/* Hiển thị thông báo cho MANAGER */}
          {!isAdmin && (
            <div className="info-message">
              <p><strong>Note:</strong> This project will be automatically assigned to you as the manager.</p>
            </div>
          )}

          <div className="modal-actions">
            <button type="submit">Add Project</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProjectModal;