import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import CCTV from './pages/CCTV';
import History from './pages/History';
import Manage from './pages/Manage';
import MultiCCTV from './pages/MultiCCTV';
import Statistics from './pages/Statistics';
import Profile from './pages/Profile';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="cctv" element={<CCTV />} />
          <Route path="history" element={<History />} />
          <Route path="manage" element={<Manage />} />
          <Route path="multi-cctv" element={<MultiCCTV />} />
          <Route path="profile" element={<Profile />} />
          <Route path="statistics" element={<Statistics />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;