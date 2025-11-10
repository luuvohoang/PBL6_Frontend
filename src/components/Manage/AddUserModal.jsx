import { useState } from 'react';

/**
 * Component này giờ nhận thêm prop 'roles' (danh sách tất cả vai trò)
 */
const AddUserModal = ({ onClose, onAdd, roles }) => {
  
  // Sửa: Tên trường (field) phải khớp với UserCreationRequest DTO
  const [formData, setFormData] = useState({
    name: '',       // Sửa: 'name' thay vì 'username'
    email: '',
    password: '',
    roles: []       // Sửa: 'roles' (một mảng) thay vì 'roleid'
  });
  
  // Hàm này xử lý các input 'text', 'email', 'password'
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  /**
   * Thêm: Hàm này xử lý các checkbox 'roles'
   */
  const handleRolesChange = (e) => {
    const { value, checked } = e.target;
    const currentRoles = formData.roles;

    if (checked) {
      // Thêm tên role vào mảng
      setFormData({ ...formData, roles: [...currentRoles, value] });
    } else {
      // Xóa tên role khỏi mảng
      setFormData({ ...formData, roles: currentRoles.filter(roleName => roleName !== value) });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Sửa: Không 'fetch' ở đây.
    // Chỉ cần gọi 'onAdd' (truyền lên component cha)
    // Manage.jsx sẽ xử lý việc gọi API.
    onAdd(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Add New User</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Sửa: 'name' (khớp DTO) */}
          <div className="form-group">
            <label htmlFor="name">Username:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Xóa: 'fullname' (không tồn tại trong DTO) */}

          {/* Giữ nguyên: 'email' */}
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Xóa: 'phone' (không tồn tại trong DTO) */}

          {/* Giữ nguyên: 'password' */}
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* S-"SỬA LẠI HOÀN TOÀN: Hiển thị Checkbox cho 'roles' */}
          <div className="form-group">
            <label>Roles:</label>
            {/* Lặp qua danh sách 'roles' (lấy từ API) */}
            {roles && roles.length > 0 ? (
              roles.map(role => (
                <div key={role.name} className="checkbox-item">
                  <input
                    type="checkbox"
                    id={`role-${role.name}`}
                    name="roles"
                    value={role.name} // Gửi đi TÊN (name) của Role
                    onChange={handleRolesChange}
                  />
                  <label htmlFor={`role-${role.name}`}>{role.name}</label>
                </div>
              ))
            ) : (
              <p>Đang tải Roles...</p>
            )}
          </div>

          <div className="modal-actions">
            <button type="submit">Add User</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;