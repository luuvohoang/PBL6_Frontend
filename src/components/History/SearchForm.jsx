import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const SearchForm = ({ cameraProjects, onSearch }) => {
  const [selectedSite, setSelectedSite] = useState('');
  const [selectedChannel, setSelectedChannel] = useState('');
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  // Get unique sites
  const sites = [...new Set(cameraProjects.map(item => item.project_name))];
  
  // Get channels for selected site
  const channels = cameraProjects
    .filter(item => item.project_name === selectedSite)
    .map(item => item.camera_name);

  useEffect(() => {
    if (sites.length > 0 && !selectedSite) {
      setSelectedSite(sites[0]);
    }
  }, [sites]);

  useEffect(() => {
    if (channels.length > 0) {
      setSelectedChannel(channels[0]);
    }
  }, [selectedSite]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!selectedChannel) {
      alert("Please select an onsite.");
      return;
    }

    if (!fromDate || !toDate) {
      alert("Please select both start and end dates.");
      return;
    }

    if (fromDate > toDate) {
      alert("End date must be greater than start date");
      return;
    }

    onSearch({
      site: selectedSite,
      channel: selectedChannel,
      fromDate: fromDate.toISOString(),
      toDate: toDate.toISOString()
    });
  };

  return (
    <div className="box-searchs">
      <div className="item-title">
        <h3>Search Detection History</h3>
        <p>Retrieve alarms history based on detection period and location</p>
      </div>

      <form className="search-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Onsite</label>
          <select 
            value={selectedSite}
            onChange={(e) => setSelectedSite(e.target.value)}
          >
            {sites.map(site => (
              <option key={site} value={site}>{site}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Channel</label>
          <select
            value={selectedChannel}
            onChange={(e) => setSelectedChannel(e.target.value)}
          >
            {channels.map(channel => (
              <option key={channel} value={channel}>{channel}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>From Date</label>
          <DatePicker
            selected={fromDate}
            onChange={date => setFromDate(date)}
            dateFormat="dd/MM/yyyy"
            placeholderText="Select start date"
          />
        </div>

        <div className="form-group">
          <label>To Date</label>
          <DatePicker
            selected={toDate}
            onChange={date => setToDate(date)}
            dateFormat="dd/MM/yyyy"
            placeholderText="Select end date"
            minDate={fromDate}
          />
        </div>

        <button type="submit" className="search-button">
          Search
          <i className="fas fa-search"></i>
        </button>
      </form>
    </div>
  );
};

export default SearchForm;