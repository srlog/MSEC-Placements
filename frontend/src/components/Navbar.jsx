import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
	Home,
	Calendar,
	User,
	Settings,
	LogOut,
	Menu,
	X,
	Users,
	MessageCircle,
	BookOpen,
	BarChart3,
	Wrench,
	Building,
} from "lucide-react";
import { logout } from "../services/authService";
import { useEffect } from "react";
import { getCurrentUser } from "../services/authService";

const Navbar = ({ user }) => {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const location = useLocation();
	const navigate = useNavigate();
	const handleLogout = () => {
		logout();
		// Force a page reload to reset the app state
		window.location.href = "/login";
	};

	const studentNavItems = [
		{ path: "/dashboard", label: "Dashboard", icon: Home },
		{ path: "/drives", label: "Drives", icon: Calendar },
		{ path: "/students", label: "Students", icon: Users },
		{ path: "/profile", label: "Profile", icon: User },
	];
	// console.log(user);

	const adminNavItems = [
		{ path: "/admin/dashboard", label: "Dashboard", icon: Home },
		{ path: "/admin/drives", label: "Manage Drives", icon: Calendar },
		{ path: "/admin/companies", label: "Companies", icon: Building },
		{ path: "/admin/queries", label: "Queries", icon: MessageCircle },
		{ path: "/admin/students", label: "Students", icon: Users },
		{ path: "/admin/skills", label: "Skills", icon: Wrench },
	];

	const isActive = (path) => {
		if (path === "/dashboard" || path === "/admin/dashboard") {
			return location.pathname === path;
		}
		return location.pathname.startsWith(path);
	};

	// Don't show navbar on login/register pages or if user is not authenticated
	// if (!user || !user.role) return null;
  const user1 = getCurrentUser();
  useEffect( () => {
    // const user = getCurrentUser();
    // console.log(user1);
  },[user1])
  
	const navItems = user1?.role === "admin" ? adminNavItems : studentNavItems;


	return (
		<div className="p-1">
			<nav className="bg-primary-900 shadow-md border border-gray-800 rounded-xl">
				<div className="container mx-auto px-2">
					<div className="flex justify-between items-center h-12">
						{/* Logo */}
						<Link to="/" className="flex items-center space-x-2">
							<img
								src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRE42PqYdLvnaPSo25OHdjiD0UFxozdVUQiXQ&s"
								className="h-8 w-8 rounded-sm"
								alt="logo"
							/>
							<span className="text-lg font-semibold text-white">
								MSEC Portal
							</span>
						</Link>

						{/* Desktop Navigation */}
						<div className="hidden md:flex items-center space-x-1">
							{navItems.map((item) => {
								const Icon = item.icon;
								return (
									<Link
										key={item.path}
										to={item.path}
										className={`flex items-center space-x-2 px-2 py-1 rounded-lg transition-all duration-150 text-sm font-medium ${
											isActive(item.path)
												? "bg-white text-primary-900 shadow"
												: "text-white hover:text-primary-900 hover:bg-white hover:bg-opacity-90"
										}`}
									>
										<Icon className="h-4 w-4" />
										<span>{item.label}</span>
									</Link>
								);
							})}
						</div>

						{/* User Menu */}
						<div className="hidden md:flex items-center space-x-2">
							<div className="text-right">
								<p className="text-sm font-medium text-white">{user.name}</p>
								<p className="text-xs text-blue-200 capitalize">{user.role}</p>
							</div>
							<button
								onClick={handleLogout}
								className="flex items-center space-x-2 px-3 py-1.5 text-white hover:text-red-300 hover:bg-red-500 hover:bg-opacity-20 rounded-lg transition-all duration-150 text-sm font-medium"
							>
								<LogOut className="h-4 w-4" />
								<span>Logout</span>
							</button>
						</div>

						{/* Mobile Menu Button */}
						<button
							onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
							className="md:hidden p-1 rounded-lg text-white hover:text-primary-900 hover:bg-white hover:bg-opacity-90"
							aria-label="Toggle menu"
						>
							{isMobileMenuOpen ? (
								<X className="h-5 w-5" />
							) : (
								<Menu className="h-5 w-5" />
							)}
						</button>
					</div>

					{/* Mobile Navigation */}
					{isMobileMenuOpen && (
						<div className="md:hidden py-3 border-t border-primary-800">
							<div className="space-y-2">
								{navItems.map((item) => {
									const Icon = item.icon;
									return (
										<Link
											key={item.path}
											to={item.path}
											onClick={() => setIsMobileMenuOpen(false)}
											className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-150 text-sm font-medium ${
												isActive(item.path)
													? "bg-white text-primary-900"
													: "text-white hover:text-primary-900 hover:bg-white hover:bg-opacity-90"
											}`}
										>
											<Icon className="h-4 w-4" />
											<span>{item.label}</span>
										</Link>
									);
								})}

								<div className="border-t border-primary-800 pt-3 mt-3">
									<div className="px-3 py-1">
										<p className="text-sm font-medium text-white">
											{user.name}
										</p>
										<p className="text-xs text-blue-200 capitalize">
											{user.role}
										</p>
									</div>
									<button
										onClick={handleLogout}
										className="flex items-center space-x-3 px-3 py-2 w-full text-left text-white hover:text-red-300 hover:bg-red-500 hover:bg-opacity-20 rounded-lg transition-all duration-150 text-sm font-medium"
									>
										<LogOut className="h-4 w-4" />
										<span>Logout</span>
									</button>
								</div>
							</div>
						</div>
					)}
				</div>
			</nav>
		</div>
	);
};

export default Navbar;
