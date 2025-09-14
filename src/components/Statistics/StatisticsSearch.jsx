import { useState } from 'react';
import DatePicker from 'react-datepicker';

const StatisticsSearch = ({ cameras, onSearch }) => {
  const [selectedCamera, setSelectedCamera] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedCamera) {
      alert("Please select a camera");
      return;
    }

    if (!startDate || !endDate) {
      alert("Please select both start and end dates");
      return;
    }

    if (startDate > endDate) {
      alert("End date must be greater than start date");
      return;
    }

    onSearch({
      camera: selectedCamera,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    });
  };

  return (
    <div className="search-onsite-statistics">
      <div className="element-title">
        <h3>Search Onsite Statistics</h3>
        <p>Set statistical data period</p>
      </div>

      <form className="element-search" onSubmit={handleSubmit}>
        <div className="button">
          <div className="button1">
            <span>Channel</span>
          </div>
          <div className="button2">
            <select 
              value={selectedCamera}
              onChange={(e) => setSelectedCamera(e.target.value)}
            >
              <option value="">Select Camera</option>
              {cameras.map(camera => (
                <option 
                  key={camera.camera_name} 
                  value={camera.camera_name}
                >
                  {camera.camera_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="date-time">
          <span>
            From: 
            <DatePicker
              selected={startDate}
              onChange={date => setStartDate(date)}
              dateFormat="dd/MM/yyyy"
            />
          </span>
          <span>
            To: 
            <DatePicker
              selected={endDate}
              onChange={date => setEndDate(date)}
              dateFormat="dd/MM/yyyy"
              minDate={startDate}
            />
          </span>
        </div>

        <button type="submit" className="button-search">
          Search
        </button>
      </form>
    </div>
  );
};

export default StatisticsSearch;