import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';

// Public & Auth Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';
import Showcase from './pages/Showcase';

// Functional Pages
import EmergencyRequest from './pages/EmergencyRequest';
import Shelters from './pages/Shelters';
import Resources from './pages/Resources';
import DisasterAlerts from './pages/DisasterAlerts';
import MedicalHelp from './pages/MedicalHelp';
import SafetyAssistant from './pages/SafetyAssistant';
import MobileBottomNav from './components/MobileBottomNav';

// Victim Pages
import VictimDashboard from './pages/VictimDashboard';
import VictimHistory from './pages/VictimHistory';
import UserProfile from './pages/UserProfile';

// Volunteer Pages
import VolunteerDashboard from './pages/VolunteerDashboard';
import VolunteerAssigned from './pages/VolunteerAssigned';
import VolunteerAvailable from './pages/VolunteerAvailable';
import VolunteerMessages from './pages/VolunteerMessages';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminVolunteers from './pages/AdminVolunteers';
import AdminShelters from './pages/AdminShelters';
import AdminRequests from './pages/AdminRequests';
import AdminResources from './pages/AdminResources';
import AdminAnalytics from './pages/AdminAnalytics';
import AdminAlerts from './pages/AdminAlerts';
import AdminSettings from './pages/AdminSettings';

// Role-based smart redirect
function DashboardRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
  if (user.role === 'volunteer') return <Navigate to="/volunteer/dashboard" replace />;
  return <Navigate to="/victim/dashboard" replace />;
}

export default function App() {
  return (
    <ErrorBoundary>
      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/showcase" element={<Showcase />} />
        <Route path="/poster" element={<Showcase />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />

        {/* Direct Functional Links */}
        <Route path="/emergency" element={<EmergencyRequest />} />
        <Route path="/shelters" element={<Shelters />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/food-medical" element={<Resources />} />
        <Route path="/medical" element={<MedicalHelp />} />
        <Route path="/safety" element={<SafetyAssistant />} />
        <Route path="/alerts" element={<DisasterAlerts />} />

        {/* Smart Dashboard Redirect */}
        <Route path="/dashboard" element={<DashboardRedirect />} />

        {/* Backward-Compatible Dashboard Routes */}
        <Route path="/dashboard/victim" element={<VictimDashboard />} />
        <Route path="/dashboard/volunteer" element={<VolunteerDashboard />} />
        <Route path="/dashboard/admin" element={<AdminDashboard />} />

        {/* Victim Section */}
        <Route path="/victim/dashboard" element={<VictimDashboard />} />
        <Route path="/victim/emergency-request" element={<EmergencyRequest />} />
        <Route path="/victim/shelters" element={<Shelters />} />
        <Route path="/victim/resources" element={<Resources />} />
        <Route path="/victim/medical" element={<MedicalHelp />} />
        <Route path="/victim/safety" element={<SafetyAssistant />} />
        <Route path="/victim/alerts" element={<DisasterAlerts />} />
        <Route path="/victim/history" element={<VictimHistory />} />
        <Route path="/victim/profile" element={<UserProfile />} />

        {/* Volunteer Section */}
        <Route path="/volunteer/dashboard" element={<VolunteerDashboard />} />
        <Route path="/volunteer/assigned" element={<VolunteerAssigned />} />
        <Route path="/volunteer/available" element={<VolunteerAvailable />} />
        <Route path="/volunteer/shelters" element={<Shelters />} />
        <Route path="/volunteer/resources" element={<Resources />} />
        <Route path="/volunteer/medical" element={<MedicalHelp />} />
        <Route path="/volunteer/messages" element={<VolunteerMessages />} />
        <Route path="/volunteer/profile" element={<UserProfile />} />

        {/* Admin Section */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/volunteers" element={<AdminVolunteers />} />
        <Route path="/admin/shelters" element={<AdminShelters />} />
        <Route path="/admin/requests" element={<AdminRequests />} />
        <Route path="/admin/resources" element={<AdminResources />} />
        <Route path="/admin/analytics" element={<AdminAnalytics />} />
        <Route path="/admin/alerts" element={<AdminAlerts />} />
        <Route path="/admin/settings" element={<AdminSettings />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Global Mobile Bottom Navigation Bar */}
      <MobileBottomNav />
    </ErrorBoundary>
  );
}
