import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, GraduationCap, Award, Edit, Github, Linkedin, Globe, Eye } from 'lucide-react';
import { fetchMyPortfolio } from '../../services/portfolioService';
import { getCurrentUser } from '../../services/authService';
import Loader from '../../components/Loader';
import ErrorBanner from '../../components/ErrorBanner';

const ProfileViewPage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await fetchMyPortfolio();
        setProfile(data.student);
      } catch (error) {
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleViewPublicProfile = () => {
    navigate(`/students/${currentUser.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg">Profile not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <div className="flex space-x-4">
              <button
                onClick={handleViewPublicProfile}
                className="inline-flex items-center bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-colors duration-200 shadow-lg"
              >
                <Eye className="h-5 w-5 mr-2" />
                Public Profile
              </button>
              <Link
                to="/profile/edit"
                className="inline-flex items-center bg-primary-900 text-white px-6 py-3 rounded-xl hover:bg-primary-800 transition-colors duration-200 shadow-lg"
              >
                <Edit className="h-5 w-5 mr-2" />
                Edit Profile
              </Link>
            </div>
          </div>

          <ErrorBanner message={error} onClose={() => setError('')} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Profile Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <User className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">Full Name</p>
                          <p className="font-medium text-gray-900">{profile.name}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <Mail className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">Email</p>
                          <p className="font-medium text-gray-900">{profile.email}</p>
                        </div>
                      </div>
                    </div>

                    {profile.mobile && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center space-x-3">
                          <Phone className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-600">Mobile</p>
                            <p className="font-medium text-gray-900">{profile.mobile}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <GraduationCap className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">Registration Number</p>
                          <p className="font-medium text-gray-900">{profile.reg_no}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {profile.residential_address && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <MapPin className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">Address</p>
                          <p className="font-medium text-gray-900">{profile.residential_address}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Academic Information */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Academic Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profile.department && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <GraduationCap className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">Department</p>
                          <p className="font-medium text-gray-900">{profile.department}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {profile.cgpa && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <Award className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">CGPA</p>
                          <p className="font-medium text-gray-900">{profile.cgpa}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {profile.year && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <GraduationCap className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">Year</p>
                          <p className="font-medium text-gray-900">{profile.year}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {profile.section && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <GraduationCap className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">Section</p>
                          <p className="font-medium text-gray-900">{profile.section}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Bio */}
              {profile.bio && (
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">About Me</h2>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
                  </div>
                </div>
              )}

              {/* Professional Links */}
              {(profile.portfolio || profile.github_profile || profile.linkedin_profile) && (
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Professional Links</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profile.portfolio && (
                      <a
                        href={profile.portfolio}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors duration-200 group"
                      >
                        <div className="flex items-center space-x-3">
                          <Globe className="h-5 w-5 text-blue-600" />
                          <div>
                            <p className="font-medium text-gray-900 group-hover:text-blue-600">Portfolio</p>
                            <p className="text-sm text-gray-600 truncate">{profile.portfolio}</p>
                          </div>
                        </div>
                      </a>
                    )}

                    {profile.github_profile && (
                      <a
                        href={profile.github_profile}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors duration-200 group"
                      >
                        <div className="flex items-center space-x-3">
                          <Github className="h-5 w-5 text-gray-900" />
                          <div>
                            <p className="font-medium text-gray-900 group-hover:text-gray-700">GitHub</p>
                            <p className="text-sm text-gray-600 truncate">{profile.github_profile}</p>
                          </div>
                        </div>
                      </a>
                    )}

                    {profile.linkedin_profile && (
                      <a
                        href={profile.linkedin_profile}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors duration-200 group"
                      >
                        <div className="flex items-center space-x-3">
                          <Linkedin className="h-5 w-5 text-blue-700" />
                          <div>
                            <p className="font-medium text-gray-900 group-hover:text-blue-700">LinkedIn</p>
                            <p className="text-sm text-gray-600 truncate">{profile.linkedin_profile}</p>
                          </div>
                        </div>
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Skills */}
              {profile.skills && profile.skills.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Skills</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profile.skills.map((skill, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4">
                        <h3 className="font-medium text-gray-900 mb-2">{skill.name || skill}</h3>
                        {skill.description && (
                          <p className="text-sm text-gray-600 mb-2">{skill.description}</p>
                        )}
                        {skill.proof_url && (
                          <a
                            href={skill.proof_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-900 hover:text-primary-800 text-sm font-medium"
                          >
                            View Proof →
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Profile Completion */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Completion</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Overall</span>
                    <span className="text-sm font-medium text-green-600">85%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-green-500 h-3 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                  <p className="text-xs text-gray-500">
                    Complete your profile to increase visibility to recruiters
                  </p>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Applications</span>
                    <span className="text-sm font-medium">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Interviews</span>
                    <span className="text-sm font-medium">5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Offers</span>
                    <span className="text-sm font-medium text-green-600">2</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileViewPage;