import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, Hash, GraduationCap, Users, BookOpen, Shield } from 'lucide-react';
import { register } from '../../services/authService';
import FormInput from '../../components/FormInput';
import ErrorBanner from '../../components/ErrorBanner';
import Loader from '../../components/Loader';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    reg_no: '',
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
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
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const { confirmPassword, ...registrationData } = formData;
      await register(registrationData);
      setSuccess('Registration successful! Please login to continue.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      setError('Registration failed. Please check your details and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Side - Registration Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="max-w-md w-full space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
           
            <h2 className="text-2xl font-bold text-primary-900">MSEC Placement Portal</h2>
          </div>

          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Join MSEC Portal</h2>
            <p className="text-gray-600">Create your account to start your placement journey</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <ErrorBanner message={error} onClose={() => setError('')} />
            
            {success && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4 animate-slide-up">
                <p className="text-green-800 text-sm">{success}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <FormInput
                  label="Registration Number"
                  type="text"
                  name="reg_no"
                  value={formData.reg_no}
                  onChange={handleChange}
                  placeholder="Enter your registration number"
                  required
                />
                <Hash className="absolute right-3 top-9 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>

              <div className="relative">
                <FormInput
                  label="Full Name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />
                <User className="absolute right-3 top-9 h-5 w-5 text-gray-400 pointer-events-none" />
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
                  placeholder="Create a password"
                  required
                />
                <Lock className="absolute right-3 top-9 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>

              <div className="relative">
                <FormInput
                  label="Confirm Password"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
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
                    <UserPlus className="h-5 w-5 mr-2" />
                    Create Account
                  </>
                )}
              </button>

              <div className="text-center">
                <p className="text-gray-600">
                  Already have an account?{' '}
                  <Link to="/login" className="text-primary-900 hover:text-primary-800 font-medium transition-colors duration-200">
                    Sign in here
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

      {/* Right Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center p-12 bg-primary-900 text-white relative overflow-hidden">
        {/* Geometric Patterns */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-32 h-32 border-2 border-white transform -rotate-45"></div>
          <div className="absolute top-40 left-32 w-24 h-24 border-2 border-white rounded-full"></div>
          <div className="absolute bottom-32 right-32 w-40 h-40 border-2 border-white transform rotate-12"></div>
          <div className="absolute bottom-20 left-20 w-16 h-16 border-2 border-white rounded-full"></div>
          <div className="absolute top-1/2 right-1/4 w-20 h-20 border-2 border-white transform rotate-45"></div>
        </div>

        <div className="relative z-10 text-center max-w-md">
          <div className="mb-8">
            <div className="bg-white bg-opacity-20 p-6 rounded-2xl inline-block mb-6">
              <GraduationCap className="h-20 w-20 text-white" />
            </div>
            <h1 className="text-6xl font-bold mb-4 leading-tight">
              Start Your
            </h1>
            <h2 className="text-2xl font-light mb-6 opacity-90">
              Career Journey
            </h2>
            <p className="text-lg opacity-80 leading-relaxed">
              Join thousands of students who have found their dream jobs through MSEC
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center space-x-4 bg-white bg-opacity-10 p-4 rounded-xl">
              <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-lg">Learn from Experiences</h3>
                <p className="text-sm opacity-80">Access interview experiences and tips</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 bg-white bg-opacity-10 p-4 rounded-xl">
              <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-lg">Build Your Network</h3>
                <p className="text-sm opacity-80">Connect with alumni and peers</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 bg-white bg-opacity-10 p-4 rounded-xl">
              <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-lg">Secure & Trusted</h3>
                <p className="text-sm opacity-80">Your data is safe and protected</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;