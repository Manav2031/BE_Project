import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import Admin from './components/Admin';
import Footer from './components/Footer.js';
import Home from './components/Home';
import Team from './components/Team.js';
import Documentation from './components/Documentation.js';
import Userlogin from './components/Userlogin';
import AdminLogin from './components/AdminLogin';
import Register from './components/Register';
import Functionality from './components/Functionality.js';
import CheckSystemHealth from './components/CheckSystemHealth.js';
import BrowserHistory from './components/BrowserHistory.js';
import ConnectedDevices from './components/ConnectedDevices.js';
import NetworkDetails from './components/NetworkDetails.js';
import NetworkRequests from './components/NetworkRequests.js';
import AddSystem from './components/AddSystem';
import ViewLogs from './components/ViewLogs';
import ViewGraphs from './components/ViewGraphs.js';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Admin" element={<Admin />} />
        <Route path="/AdminLogin" element={<AdminLogin />} />
        <Route path="/login" element={<Userlogin />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/team" element={<Team />} />
        <Route path="/documentation" element={<Documentation />} />
        <Route path="/functionality" element={<Functionality />} />
        <Route path="/check-system-health" element={<CheckSystemHealth />} />
        <Route path="/view-browser-history" element={<BrowserHistory />} />
        <Route path="/view-connected-devices" element={<ConnectedDevices />} />
        <Route path="/view-network-details" element={<NetworkDetails />} />
        <Route path="/view-network-requests" element={<NetworkRequests />} />
        <Route path="/add-system" element={<AddSystem />} />
        <Route path="/view-logs" element={<ViewLogs />} />
        <Route path="/view-graphs" element={<ViewGraphs />} />
      </Routes>
      <ToastContainer />
      <Footer />
    </Router>
  );
}

export default App;
