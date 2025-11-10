  // File: src/components/Manage/EditRoleModal.jsx
  import { useState, useEffect } from 'react';

  const EditRoleModal = ({ role, allPermissions, onClose, onUpdate }) => {
    
    // State chỉ chứa các trường có thể SỬA
    // (Giả sử bạn không SỬA tên Role (khóa chính))
    const [formData, setFormData] = useState({
      description: '',
      permissions: [] // Mảng các tên (String) của permission
    });

    // Điền dữ liệu vào form khi 'role' được truyền vào
    useEffect(() => {
      if (role) {
        setFormData({
          description: role.description || '',
          // 'role.permissions' là mảng đối tượng
          // Chuyển nó thành mảng tên (String)
          permissions: role.permissions ? role.permissions.map(p => p.name) : []
        });
      }
    }, [role]);

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
      // Gọi onUpdate (từ Manage.jsx) với TÊN của role và DỮ LIỆU mới
      onUpdate(role.name, formData);
    };

    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-header">
            <h2>Edit Role: {role.name}</h2>
            <button className="close-btn" onClick={onClose}>&times;</button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Role Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={role.name}
                disabled // Không cho sửa tên (khóa chính)
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
                      id={`perm-edit-${perm.name}`}
                      name="permissions"
                      value={perm.name}
                      // Tự động check nếu tên perm có trong formData
                      checked={formData.permissions.includes(perm.name)} 
                      onChange={handlePermissionChange}
                    />
                    <label htmlFor={`perm-edit-${perm.name}`}>{perm.name}</label>
                  </div>
                ))
              ) : (
                <p>Loading permissions...</p>
              )}
            </div>

            <div className="modal-actions">
              <button type="submit">Update</button>
              <button type="button" onClick={onClose}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  export default EditRoleModal;