import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { getCurrentUser } from './services/authService';
import ProtectedRoute from './config/ProtectedRoute';

// Public Pages
import LoginPage from './pages/Public/LoginPage';
import RegisterPage from './pages/Public/RegisterPage';

// Student Pages
import DashboardPage from './pages/Student/DashboardPage';
import DrivesListPage from './pages/Student/DrivesListPage';
import DriveDetailPage from './pages/Student/DriveDetailPage';
import JourneyForm from './pages/Student/JourneyForm';
import ProfileViewPage from './pages/Student/ProfileViewPage';
import ProfileEditPage from './pages/Student/ProfileEditPage';
import StudentsListPage from './pages/Student/StudentsListPage';
import PublicProfilePage from './pages/Student/PublicProfilePage';

// Admin Pages
import AdminDashboardPage from './pages/Admin/AdminDashboardPage';
import ManageDrivesPage from './pages/Admin/ManageDrivesPage';
import DriveFormPage from './pages/Admin/DriveFormPage';
import DriveEditPage from './pages/Admin/DriveEditPage';
import AdminDriveDetailPage from './pages/Admin/AdminDriveDetailPage';
import UnansweredQueriesPage from './pages/Admin/UnansweredQueriesPage';
import StudentShortlistPage from './pages/Admin/StudentShortlistPage';
import ManageSkillsPage from './pages/Admin/ManageSkillsPage';

// Layout Components
import Navbar from './components/Navbar';

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize user state on app load
    const initializeAuth = () => {
      try {
        const currentUser = getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Error initializing auth:', error);
        setUser({});
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Listen for storage changes (logout from another tab)
    const handleStorageChange = (e) => {
      if (e.key === 'user' || e.key === 'token') {
        const currentUser = getCurrentUser();
        setUser(currentUser);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-900"></div>
      </div>
    );
  }

  const isAuthenticated = !!user?.id;

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {isAuthenticated && <Navbar user={user} />}
        
        <Routes>
          {/* Public Routes */}
          <Route 
            path="/login" 
            element={!isAuthenticated ? <LoginPage /> : <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'} replace />} 
          />
          <Route 
            path="/register" 
            element={!isAuthenticated ? <RegisterPage /> : <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'} replace />} 
          />

          {/* Student Protected Routes */}
          <Route element={<ProtectedRoute role="student" />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/drives" element={<DrivesListPage />} />
            <Route path="/drives/:driveId" element={<DriveDetailPage />} />
            <Route path="/drives/:driveId/journeys/new" element={<JourneyForm />} />
            <Route path="/profile" element={<ProfileViewPage />} />
            <Route path="/profile/edit" element={<ProfileEditPage />} />
            <Route path="/students" element={<StudentsListPage />} />
            <Route path="/students/:studentId" element={<PublicProfilePage />} />
          </Route>

          {/* Admin Protected Routes */}
          <Route element={<ProtectedRoute role="admin" />}>
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            <Route path="/admin/drives" element={<ManageDrivesPage />} />
            <Route path="/admin/drives/new" element={<DriveFormPage />} />
            <Route path="/admin/drives/:driveId/edit" element={<DriveEditPage />} />
            <Route path="/admin/drives/:driveId" element={<AdminDriveDetailPage />} />
            <Route path="/admin/queries" element={<UnansweredQueriesPage />} />
            <Route path="/admin/students" element={<StudentShortlistPage />} />
            <Route path="/admin/skills" element={<ManageSkillsPage />} />
          </Route>

          {/* Default Redirects */}
          <Route 
            path="/" 
            element={
              <Navigate 
                to={
                  !isAuthenticated 
                    ? '/login' 
                    : user.role === 'admin' 
                      ? '/admin/dashboard' 
                      : '/dashboard'
                } 
                replace
              />
            } 
          />
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;