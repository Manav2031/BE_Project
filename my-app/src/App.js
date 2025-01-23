import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import Admin from './components/Admin';
import Footer from './components/Footer.js'
import Home from './components/Home';
import Team from "./components/Team.js";
import Documentation from "./components/Documentation.js"
import Userlogin from './components/Userlogin';
import AdminLogin from './components/AdminLogin';
import Register from "./components/Register";
import Functionality from './components/Functionality.js';
import CheckSystemHealth from "./components/CheckSystemHealth";
import AddSystem from "./components/AddSystem";
import ViewLogs from "./components/ViewLogs";
import ViewGraphs from "./components/ViewGraphs.js";

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
        <Route path="/documentation" element={<Documentation/>}/>
        <Route path="/functionality" element={<Functionality/>} />
        <Route path="/check-system-health" element={<CheckSystemHealth />} />
        <Route path="/add-system" element={<AddSystem />} />
        <Route path="/view-logs" element={<ViewLogs />} />
        <Route path="/view-graphs" element={<ViewGraphs />} />
      </Routes>
      <ToastContainer />
<<<<<<< HEAD
      <Footer></Footer>
=======
>>>>>>> 6f3a9bda2f19b3dabe81365e6f56ecc153e501cf
    </Router>
  );
}

export default App;
