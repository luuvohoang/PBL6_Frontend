import { useState } from 'react';

const AddCameraModal = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    cameraname: '',
    ipadress: '',
    status: '',
    projectname: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(formData);
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
          <h2>Add Camera</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="cameraname">Camera Name:</label>
            <input
              type="text"
              id="cameraname"
              name="cameraname"
              value={formData.cameraname}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="ipadress">IP Address:</label>
            <input
              type="text"
              id="ipadress"
              name="ipadress"
              value={formData.ipadress}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="status">Status:</label>
            <input
              type="text"
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="projectname">Project:</label>
            <input
              type="text"
              id="projectname"
              name="projectname"
              value={formData.projectname}
              onChange={handleChange}
              required
            />
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

export default AddCameraModal;