// App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
import NotFoundPage from './pages/not-found/NotFoundPage';
import Navbar from './common/navbar/Navbar';
import { ToastContainer } from 'react-toastify';
import { isLoggedIn } from './utils/authUtils';

/* ---------- Route guards ---------- */

// redirect to /jobs if already authenticated
const PublicOnlyRoute: React.FC<{ element: JSX.Element }> = ({ element }) =>
  isLoggedIn() ? <Navigate to="/jobs" replace /> : element;

// redirect to /login if not authenticated
const PrivateRoute: React.FC<{ element: JSX.Element }> = ({ element }) =>
  isLoggedIn() ? element : <Navigate to="/login" replace />;

/* ---------- App component ---------- */

const App: React.FC = () => {
  return (
    <Router>
      <ToastContainer />
      <Navbar />

      {/* main content */}
      <div className="mt-4">
        <Routes>
          {/* public pages */}
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />

          {/* auth‑only pages */}
          <Route path="/profile" element={<PrivateRoute element={<Profile />} />} />
          <Route path="/contracts" element={<PrivateRoute element={<Contracts />} />} />
          <Route path="/employees" element={<PrivateRoute element={<Employees />} />} />
          <Route path="/messages" element={<PrivateRoute element={<Messages />} />} />

          {/* pages hidden once you’re logged in */}
          <Route path="/login" element={<PublicOnlyRoute element={<Login />} />} />
          <Route path="/register" element={<PublicOnlyRoute element={<Register />} />} />
          <Route path="/reset-password" element={<PublicOnlyRoute element={<ResetPassword />} />} />

          {/* catch‑all */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
