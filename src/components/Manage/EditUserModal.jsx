import { useState, useEffect } from 'react';

const EditUserModal = ({ user, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    userid: '',
    username: '',
    fullname: '',
    email: '',
    phone: '',
    password: '',
    roleid: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        userid: user.users_ID,
        username: user.users_name,
        fullname: user.full_name,
        email: user.email,
        phone: user.phone,
        password: '', // Password field is empty by default when editing
        roleid: user.role_ID
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:8081/api/modifyuser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        onUpdate(formData);
        onClose();
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Edit User</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="fullname">Full Name:</label>
            <input
              type="text"
              id="fullname"
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
              required
            />
          </div>

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

          <div className="form-group">
            <label htmlFor="phone">Phone:</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              Password: {formData.userid && '(Leave blank to keep current password)'}
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder={formData.userid ? 'Leave blank to keep current password' : ''}
              required={!formData.userid}
            />
          </div>

          <div className="form-group">
            <label htmlFor="roleid">Role:</label>
            <select
              id="roleid"
              name="roleid"
              value={formData.roleid}
              onChange={handleChange}
              required
            >
              <option value="">Select Role</option>
              <option value="1">Admin</option>
              <option value="2">User</option>
            </select>
          </div>

          <div className="modal-actions">
            <button type="submit">Update User</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;