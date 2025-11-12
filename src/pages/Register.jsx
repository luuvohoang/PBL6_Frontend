import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/register.css';
import { Snackbar, Alert } from '@mui/material';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState('');

  const handleCloseSnackBar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackBarOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    let newErrors = {};
    // Basic validation rules
    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = 'Invalid email format';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    fetch("http://localhost:8080/safetyconstruction/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: formData.username,
        email: formData.email,
        password: formData.password,
      }),
    })
    .then((response) => response.json())
    .then((data) => {
      if (data.code !== 1000) {
        throw new Error(data.message);
      }
      // Show success message
      setSnackBarMessage('Registration successful! Redirecting to login...');
      setSnackBarOpen(true);
      // Redirect to login page after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    })
    .catch((error) => {
      setSnackBarMessage(error.message);
      setSnackBarOpen(true);
    });
  };

  return (
    <>
      <Snackbar
        open={snackBarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackBar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackBar}
          severity={snackBarMessage.includes('successful') ? 'success' : 'error'}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackBarMessage}
        </Alert>
      </Snackbar>

      <div className="register-wrapper">
        <form className="box-register" onSubmit={handleSubmit}>
          <div className="title">
            <h3>Sign Up</h3>
          </div>
          <hr />
          
          {['username', 'email'].map((field) => (
            <div className="box-input" key={field}>
              <input
                type="text"
                id={field}
                name={field}
                value={formData[field]}
                onChange={handleInputChange}
              />
              <span className={`title-input ${formData[field] ? 'active' : ''}`}>
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </span>
              {errors[field] && <div className="errorMessages">{errors[field]}</div>}
            </div>
          ))}

          {['password', 'confirmPassword'].map((field) => (
            <div className="box-input" key={field}>
              <input
                type="password"
                id={field}
                name={field}
                value={formData[field]}
                onChange={handleInputChange}
              />
              <span className={`title-input ${formData[field] ? 'active' : ''}`}>
                {field === 'confirmPassword' ? 'Confirm Password' : 'Password'}
              </span>
              {errors[field] && <div className="errorMessages">{errors[field]}</div>}
            </div>
          ))}

          <div className="button-signup">
            <button type="submit">Sign Up</button>
          </div>
          <div className="button-goback">
            <button type="button" onClick={() => navigate('/login')}>Go Back</button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Register;