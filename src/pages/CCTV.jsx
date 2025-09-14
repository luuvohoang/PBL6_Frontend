import React, { useState, useEffect } from 'react';
import '../assets/styles/cctv.css';

const CCTV = () => {
  const [cameraData, setCameraData] = useState([]);
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedCamera, setSelectedCamera] = useState('');
  const [videoSrc, setVideoSrc] = useState('');
  const [cameraErrors, setCameraErrors] = useState([]);
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    // Fetch camera data from API
    const fetchCameraData = async () => {
      try {
        const response = await fetch('http://localhost:8081/api/cameras');
        const data = await response.json();
        setCameraData(data);
        if (data.length > 0) {
          setSelectedArea(data[0].area);
        }
      } catch (error) {
        console.error('Error fetching camera data:', error);
      }
    };

    fetchCameraData();
  }, []);

  // Update date time
  useEffect(() => {
    const timer = setInterval(() => {
      setDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleAreaChange = (e) => {
    const area = e.target.value;
    setSelectedArea(area);
    const camerasInArea = cameraData.filter(item => item.area === area);
    if (camerasInArea.length > 0) {
      setSelectedCamera(camerasInArea[0].name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8081/pbl3/cctv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          camera: selectedCamera,
          area: selectedArea
        })
      });
      // Handle response...
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div className="wrapper">
      <div className="box-title">
        <span>CCTV</span>
      </div>
      
      <div className="box-content">
        <div className="content-top">
          {/* CCTV Selection Form */}
          <div className="box-cctv">
            <form className="box-selects" onSubmit={handleSubmit}>
              <div className="selectss">
                <div className="select1">
                  <select 
                    className="customSelect"
                    value={selectedCamera}
                    onChange={(e) => setSelectedCamera(e.target.value)}
                  >
                    {cameraData
                      .filter(item => item.area === selectedArea)
                      .map(camera => (
                        <option key={camera.name} value={camera.name}>
                          {camera.name}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="select2">
                  <select 
                    className="customSelect"
                    value={selectedArea}
                    onChange={handleAreaChange}
                  >
                    {Array.from(new Set(cameraData.map(item => item.area)))
                      .map(area => (
                        <option key={area} value={area}>
                          {area}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
              <button type="submit" className="add">
                <h3 className="add-p">+ Submit</h3>
              </button>
            </form>

            <div className="cctv">
              {videoSrc && (
                <iframe 
                  className="video-cctv"
                  frameBorder="0"
                  src={videoSrc}
                  width="100%"
                  height="100%"
                  allow="autoplay"
                />
              )}
            </div>
          </div>

          {/* History Section */}
          <div className="box-history">
            <div className="box-date-time">
              <div className="loca-da-ti">
                <div className="date-time">
                  <div className="date">
                    <p className="title-element">Date:</p>
                    <p className="time-element">{dateTime.getDate().toString().padStart(2, '0')}</p>
                    <p className="title-element">/</p>
                    <p className="time-element">{(dateTime.getMonth() + 1).toString().padStart(2, '0')}</p>
                    <p className="title-element">/</p>
                    <p className="time-element">{dateTime.getFullYear()}</p>
                  </div>
                  <div className="time">
                    <p className="title-element">Time:</p>
                    <p className="time-element">{dateTime.getHours().toString().padStart(2, '0')}</p>
                    <p className="title-element">:</p>
                    <p className="time-element">{dateTime.getMinutes().toString().padStart(2, '0')}</p>
                    <p className="title-element">:</p>
                    <p className="time-element">{dateTime.getSeconds().toString().padStart(2, '0')}</p>
                  </div>
                </div>
              </div>
              <div className="view-in-details">
                <button>View in Details</button>
              </div>
            </div>

            <div className="box-detection-history">
              <div className="history-title">
                <h3 className="history-title-p">Detection History</h3>
              </div>
              <div className="history-list">
                <table>
                  <thead>
                    <tr>
                      <th>Time</th>
                      <th>Error Type</th>
                      <th>Detection</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cameraErrors.length > 0 ? (
                      cameraErrors.map((error, index) => (
                        <tr key={index}>
                          <td>{error.timestamp}</td>
                          <td>{error.error_type}</td>
                          <td>{error.descript}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3">No errors found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CCTV;