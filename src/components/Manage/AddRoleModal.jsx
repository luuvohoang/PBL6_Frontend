// File: src/components/Manage/AddRoleModal.jsx
import { useState } from 'react';

// Nhận 'allPermissions' từ Manage.jsx
const AddRoleModal = ({ onClose, onAdd, allPermissions }) => {
  
  // State khớp với RoleRequest DTO
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: [] // Mảng các tên (String) của permission
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePermissionChange = (e) => {
    const { value, checked } = e.target;
    const currentPermissions = formData.permissions;
    if (checked) {
      setFormData({ ...formData, permissions: [...currentPermissions, value] });
    } else {
      setFormData({ ...formData, permissions: currentPermissions.filter(p => p !== value) });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(formData); // Gửi dữ liệu (khớp DTO) lên Manage.jsx
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Add New Role</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Role Name:</label>
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
            <input
              type="text"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Permissions:</label>
            {allPermissions && allPermissions.length > 0 ? (
              allPermissions.map(perm => (
                <div key={perm.name} className="checkbox-item">
                  <input
                    type="checkbox"
                    id={`perm-add-${perm.name}`}
                    name="permissions"
                    value={perm.name} // Gửi đi TÊN (String) của Permission
                    onChange={handlePermissionChange}
                  />
                  <label htmlFor={`perm-add-${perm.name}`}>{perm.name}</label>
                </div>
              ))
            ) : (
              <p>Loading permissions...</p>
            )}
          </div>

          <div className="modal-actions">
            <button type="submit">Save</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRoleModal;