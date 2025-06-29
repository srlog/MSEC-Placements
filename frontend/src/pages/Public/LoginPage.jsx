import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock, GraduationCap, Users, TrendingUp, Award, ChevronDown } from 'lucide-react';
import { login, setAuthData } from '../../services/authService';
import FormInput from '../../components/FormInput';
import ErrorBanner from '../../components/ErrorBanner';
import Loader from '../../components/Loader';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    userType: 'student'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { userType, ...credentials } = formData;
      const response = await login(credentials, userType);
      setAuthData(response.token, response.user);
      
      // Redirect based on role
      if (response.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      if (formData.userType === 'admin') {
        setError('Invalid admin credentials. Please check your email and password.');
      } else {
        setError('Invalid student credentials. Please check your email and password.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center p-12 bg-primary-900 text-white relative overflow-hidden">
        {/* Geometric Patterns */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 border-2 border-white transform rotate-45"></div>
          <div className="absolute top-40 right-32 w-24 h-24 border-2 border-white rounded-full"></div>
          <div className="absolute bottom-32 left-32 w-40 h-40 border-2 border-white transform rotate-12"></div>
          <div className="absolute bottom-20 right-20 w-16 h-16 border-2 border-white rounded-full"></div>
          <div className="absolute top-1/2 left-1/4 w-20 h-20 border-2 border-white transform -rotate-45"></div>
        </div>

        <div className="relative z-10 text-center max-w-md">
          <div className="mb-8">
            <div className="bg-white bg-opacity-20 p-6 rounded-2xl inline-block mb-6">
              <GraduationCap className="h-20 w-20 text-white" />
            </div>
            <h1 className="text-6xl font-bold mb-4 leading-tight">
              MSEC
            </h1>
            <h2 className="text-2xl font-light mb-6 opacity-90">
              Placement Portal
            </h2>
            <p className="text-lg opacity-80 leading-relaxed">
              Your gateway to career opportunities and professional growth
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center space-x-4 bg-white bg-opacity-10 p-4 rounded-xl">
              <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-lg">Connect with Recruiters</h3>
                <p className="text-sm opacity-80">Access top companies and opportunities</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 bg-white bg-opacity-10 p-4 rounded-xl">
              <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-lg">Track Your Progress</h3>
                <p className="text-sm opacity-80">Monitor applications and interviews</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 bg-white bg-opacity-10 p-4 rounded-xl">
              <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                <Award className="h-6 w-6 text-white" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-lg">Share Experiences</h3>
                <p className="text-sm opacity-80">Help juniors with your journey</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="max-w-md w-full space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="bg-primary-900 p-3 rounded-full inline-block mb-4">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-primary-900">MSEC Placement Portal</h2>
          </div>

          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-gray-600">Sign in to access your placement dashboard</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <ErrorBanner message={error} onClose={() => setError('')} />
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* User Type Dropdown */}
              <div className="mb-4">
                <label htmlFor="userType" className="block text-sm font-medium text-gray-700 mb-2">
                  Login as <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    id="userType"
                    name="userType"
                    value={formData.userType}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-900 focus:border-transparent transition-all duration-200 appearance-none bg-white"
                  >
                    <option value="student">Student</option>
                    <option value="admin">Administrator</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div className="relative">
                <FormInput
                  label="Email Address"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
                <Mail className="absolute right-3 top-9 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>

              <div className="relative">
                <FormInput
                  label="Password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                />
                <Lock className="absolute right-3 top-9 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-900 text-white py-3 px-4 rounded-lg hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium flex items-center justify-center"
              >
                {loading ? (
                  <Loader size="sm" />
                ) : (
                  <>
                    <LogIn className="h-5 w-5 mr-2" />
                    Sign In as {formData.userType === 'admin' ? 'Administrator' : 'Student'}
                  </>
                )}
              </button>

              <div className="text-center">
                <p className="text-gray-600">
                  Don't have an account?{' '}
                  <Link to="/register" className="text-primary-900 hover:text-primary-800 font-medium transition-colors duration-200">
                    Sign up here
                  </Link>
                </p>
              </div>
            </form>
          </div>

          <div className="text-center text-sm text-gray-500">
            <p>© 2024 MSEC Placement Portal. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;