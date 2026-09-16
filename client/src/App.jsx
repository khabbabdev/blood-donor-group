import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Layout
import MainLayout from './components/layout/MainLayout';
import ProtectedRoute from './routes/ProtectedRoute';
import LoadingSpinner from './components/common/LoadingSpinner';

// Lazy Loaded Pages
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const DonorList = lazy(() => import('./pages/DonorList'));
const Services = lazy(() => import('./pages/Services'));
const Contact = lazy(() => import('./pages/Contact'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));

// Lazy Loaded Dashboards & Admin Pages
const AdminDashboard = lazy(() => import('./pages/dashboard/AdminDashboard'));
const VolunteerDashboard = lazy(() => import('./pages/dashboard/VolunteerDashboard'));
const DonorDashboard = lazy(() => import('./pages/dashboard/DonorDashboard'));
const ProfileUpdate = lazy(() => import('./pages/ProfileUpdate'));
const DonorManagement = lazy(() => import('./pages/dashboard/volunteer/DonorManagement'));
const AddDonor = lazy(() => import('./pages/dashboard/volunteer/AddDonor'));

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Suspense fallback={<LoadingSpinner fullPage />}>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Home />} />
              <Route path="about" element={<About />} />
              <Route path="donors" element={<DonorList />} />
              <Route path="services" element={<Services />} />
              <Route path="contact" element={<Contact />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="forgot-password" element={<ForgotPassword />} />
              <Route path="reset-password/:token" element={<ResetPassword />} />
              
              {/* Protected Routes */}
              <Route 
                path="dashboard/admin" 
                element={
                  <ProtectedRoute roles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="dashboard/volunteer" 
                element={
                  <ProtectedRoute roles={['volunteer']}>
                    <VolunteerDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="dashboard/volunteer/donors" 
                element={
                  <ProtectedRoute roles={['volunteer']}>
                    <DonorManagement />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="dashboard/volunteer/donors/add" 
                element={
                  <ProtectedRoute roles={['volunteer']}>
                    <AddDonor />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="dashboard/volunteer/donors/:id/edit" 
                element={
                  <ProtectedRoute roles={['volunteer']}>
                    <AddDonor />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="dashboard/donor" 
                element={
                  <ProtectedRoute roles={['donor']}>
                    <DonorDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="profile" 
                element={
                  <ProtectedRoute>
                    <ProfileUpdate />
                  </ProtectedRoute>
                } 
              />
            </Route>
          </Routes>
        </Suspense>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
