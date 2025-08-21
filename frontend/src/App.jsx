import { useState, useEffect } from "react";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import { getCurrentUser } from "./services/authService";
import ProtectedRoute from "./config/ProtectedRoute";

// Public Pages
import LoginPage from "./pages/Public/LoginPage";
import RegisterPage from "./pages/Public/RegisterPage";

// Student Pages
import DashboardPage from "./pages/Student/DashboardPage";
import DrivesListPage from "./pages/Student/DrivesListPage";
import DriveDetailPage from "./pages/Student/DriveDetailPage";
import JourneyForm from "./pages/Student/JourneyForm";
import ProfileViewPage from "./pages/Student/ProfileViewPage";
import ProfileEditPage from "./pages/Student/ProfileEditPage";
import StudentsListPage from "./pages/Student/StudentsListPage";
import PublicProfilePage from "./pages/Student/PublicProfilePage";

// Admin Pages
import AdminDashboardPage from "./pages/Admin/AdminDashboardPage";
import ManageDrivesPage from "./pages/Admin/ManageDrivesPage";
import DriveFormPage from "./pages/Admin/DriveFormPage";
import DriveEditPage from "./pages/Admin/DriveEditPage";
import AdminDriveDetailPage from "./pages/Admin/AdminDriveDetailPage";
import UnansweredQueriesPage from "./pages/Admin/UnansweredQueriesPage";
import StudentShortlistPage from "./pages/Admin/StudentShortlistPage";
import ManageSkillsPage from "./pages/Admin/ManageSkillsPage";

// Layout Components
import Navbar from "./components/Navbar";

// Layouts
function AuthLayout({ children }) {
	return <>{children}</>; // no navbar
}

function MainLayout({ children, user }) {
	return (
		<>
			<Navbar user={user} />
			<div className="content">{children}</div>
		</>
	);
}

function App() {
	const [user, setUser] = useState(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const initializeAuth = () => {
			try {
				const currentUser = getCurrentUser();
				setUser(currentUser);
			} catch (error) {
				console.error("Error initializing auth:", error);
				setUser({});
			} finally {
				setIsLoading(false);
			}
		};

		initializeAuth();

		const handleStorageChange = (e) => {
			if (e.key === "user" || e.key === "token") {
				const currentUser = getCurrentUser();
				setUser(currentUser);
			}
		};

		window.addEventListener("storage", handleStorageChange);
		return () => window.removeEventListener("storage", handleStorageChange);
	}, []);

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
			<Routes>
				{/* Public Routes */}
				<Route
					path="/login"
					element={
						<AuthLayout>
							{!isAuthenticated ? (
								<LoginPage />
							) : (
								<Navigate
									to={user.role === "admin" ? "/admin/dashboard" : "/dashboard"}
									replace
								/>
							)}
						</AuthLayout>
					}
				/>
				<Route
					path="/register"
					element={
						<AuthLayout>
							{!isAuthenticated ? (
								<RegisterPage />
							) : (
								<Navigate
									to={user.role === "admin" ? "/admin/dashboard" : "/dashboard"}
									replace
								/>
							)}
						</AuthLayout>
					}
				/>

				{/* Student Protected Routes */}
				<Route element={<ProtectedRoute role="student" />}>
					<Route
						path="/dashboard"
						element={
							<MainLayout user={user}>
								<DashboardPage />
							</MainLayout>
						}
					/>
					<Route
						path="/drives"
						element={
							<MainLayout user={user}>
								<DrivesListPage />
							</MainLayout>
						}
					/>
					<Route
						path="/drives/:driveId"
						element={
							<MainLayout user={user}>
								<DriveDetailPage />
							</MainLayout>
						}
					/>
					<Route
						path="/drives/:driveId/journeys/new"
						element={
							<MainLayout user={user}>
								<JourneyForm />
							</MainLayout>
						}
					/>
					<Route
						path="/profile"
						element={
							<MainLayout user={user}>
								<ProfileViewPage />
							</MainLayout>
						}
					/>
					<Route
						path="/profile/edit"
						element={
							<MainLayout user={user}>
								<ProfileEditPage />
							</MainLayout>
						}
					/>
					<Route
						path="/students"
						element={
							<MainLayout user={user}>
								<StudentsListPage />
							</MainLayout>
						}
					/>
					<Route
						path="/students/:studentId"
						element={
							<MainLayout user={user}>
								<PublicProfilePage />
							</MainLayout>
						}
					/>
				</Route>

				{/* Admin Protected Routes */}
				<Route element={<ProtectedRoute role="admin" />}>
					<Route
						path="/admin/dashboard"
						element={
							<MainLayout user={user}>
								<AdminDashboardPage />
							</MainLayout>
						}
					/>
					<Route
						path="/admin/drives"
						element={
							<MainLayout user={user}>
								<ManageDrivesPage />
							</MainLayout>
						}
					/>
					<Route
						path="/admin/drives/new"
						element={
							<MainLayout user={user}>
								<DriveFormPage />
							</MainLayout>
						}
					/>
					<Route
						path="/admin/drives/:driveId/edit"
						element={
							<MainLayout user={user}>
								<DriveEditPage />
							</MainLayout>
						}
					/>
					<Route
						path="/admin/drives/:driveId"
						element={
							<MainLayout user={user}>
								<AdminDriveDetailPage />
							</MainLayout>
						}
					/>
					<Route
						path="/admin/queries"
						element={
							<MainLayout user={user}>
								<UnansweredQueriesPage />
							</MainLayout>
						}
					/>
					<Route
						path="/admin/students"
						element={
							<MainLayout user={user}>
								<StudentShortlistPage />
							</MainLayout>
						}
					/>
					<Route
						path="/admin/skills"
						element={
							<MainLayout user={user}>
								<ManageSkillsPage />
							</MainLayout>
						}
					/>
				</Route>

				{/* Default Redirect */}
				<Route
					path="/"
					element={
						<Navigate
							to={
								!isAuthenticated
									? "/login"
									: user.role === "admin"
									? "/admin/dashboard"
									: "/dashboard"
							}
							replace
						/>
					}
				/>

				{/* Catch all */}
				<Route path="*" element={<Navigate to="/" replace />} />
			</Routes>
		</Router>
	);
}

export default App;
