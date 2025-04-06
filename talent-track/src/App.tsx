import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/home/Home';
import Login from './pages/login/Login';
import ResetPassword from './pages/reset-password/ResetPassword';
import Profile from './pages/profile/Profile';
import Register from './pages/register/Register';
import TermsAndConditions from './pages/terms-and-conditions/TermsAndConditions';
import Contracts from './pages/contracts/Contracts';
import Employees from './pages/employees/Employees';
import Jobs from './pages/jobs/Jobs';
import Messages from './pages/messages/Messages';
import Navbar from './common/navbar/Navbar';
import { ToastContainer } from 'react-toastify';

const App: React.FC = () => {
  return (
    <Router>
      <ToastContainer />
      <Navbar />
      <div className="mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/register" element={<Register />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/contracts" element={<Contracts />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/messages" element={<Messages />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
