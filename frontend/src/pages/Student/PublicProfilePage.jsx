import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MapPin, GraduationCap, Award, Github, Linkedin, Globe, ExternalLink } from 'lucide-react';
import CountUp from 'react-countup';
import { fetchStudentPortfolio } from '../../services/portfolioService';
import Loader from '../../components/Loader';
import ErrorBanner from '../../components/ErrorBanner';

const PublicProfilePage = () => {
  const { studentId } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await fetchStudentPortfolio(studentId);
        setProfile(data.student);
      } catch (error) {
        setError('Failed to load student profile');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [studentId]);

  const calculateProfileCompletion = (profileData) => {
    const requiredFields = [
      profileData.gender,
      profileData.fathers_name,
      profileData.date_of_birth,
      profileData.residential_address,
      profileData.mobile,
      profileData.parents_mobile_no,
      profileData.aadhar_card_no,
      profileData.department,
      profileData.year,
      profileData.section,
      profileData.cgpa,
      profileData.bio,
      profileData.linkedin_profile,
      profileData.portfolio,
      profileData.github_profile,
      profileData.skills?.length > 0
    ];
    const filled = requiredFields.filter((field) => field != null && field !== '').length;
    return Math.round((filled / requiredFields.length) * 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg">Student profile not found</p>
          <Link to="/students" className="text-primary-900 hover:text-primary-800 mt-2 inline-block">
            Back to Students
          </Link>
        </div>
      </div>
    );
  }

  const profileCompletion = calculateProfileCompletion(profile);

  const socialLinks = [
    {
      isPresent: !!profile.email,
      icon: <Mail className="h-5 w-5" />,
      label: profile.email,
      url: `mailto:${profile.email}`,
    },
    {
      isPresent: !!profile.mobile,
      icon: <Phone className="h-5 w-5" />,
      label: profile.mobile,
      url: `tel:${profile.mobile}`,
    },
    {
      isPresent: !!profile.portfolio,
      icon: <Globe className="h-5 w-5" />,
      url: profile.portfolio,
      label: 'Portfolio'
    },
    {
      isPresent: !!profile.github_profile,
      icon: <Github className="h-5 w-5" />,
      url: profile.github_profile,
      label: 'GitHub'
    },
    {
      isPresent: !!profile.linkedin_profile,
      icon: <Linkedin className="h-5 w-5" />,
      url: profile.linkedin_profile,
      label: 'LinkedIn'
    },
  ];

  const Stat = ({ label, value, extra }) => (
    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <span className="text-sm font-medium text-gray-600 mb-2">{label}</span>
      {extra ? (
        <div className="w-16 h-16">{extra}</div>
      ) : (
        <span className="text-3xl font-bold text-gray-800">
          <CountUp end={value} duration={2} />
        </span>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link 
            to="/students" 
            className="inline-flex items-center text-primary-900 hover:text-primary-800 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Students
          </Link>
        </div>

        <ErrorBanner message={error} onClose={() => setError('')} />

        {/* Profile Header */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8 border border-gray-100">
          <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-6 lg:space-y-0 lg:space-x-8">
            <div className="flex-shrink-0">
              <div className="w-32 h-32 bg-gradient-to-br from-primary-900 to-blue-600 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                {profile.name?.charAt(0)?.toUpperCase()}
              </div>
            </div>
            
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{profile.name}</h1>
              <p className="text-xl text-gray-600 mb-4">{profile.reg_no}</p>
              
              {profile.bio && (
                <p className="text-gray-700 leading-relaxed mb-6 max-w-2xl">{profile.bio}</p>
              )}
              
              <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                {socialLinks.filter(link => link.isPresent).map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full transition-colors duration-200 group"
                  >
                    {link.icon}
                    <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                      {link.label || 'Visit'}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <Stat 
            label="Profile Completion" 
            value={profileCompletion}
            extra={
              <div className="relative w-16 h-16">
                <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="3"
                  />
                  <path
                    d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="3"
                    strokeDasharray={`${profileCompletion}, 100`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold text-gray-800">{profileCompletion}%</span>
                </div>
              </div>
            }
          />
          <Stat label="Skills" value={profile.skills?.length || 0} />
          <Stat label="CGPA" value={profile.cgpa || 0} />
          <Stat label="Year" value={profile.year || 0} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Academic Information */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Academic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              </div>
            </div>

            {/* Skills Section */}
            {profile.skills && profile.skills.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Skills & Expertise ({profile.skills.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {profile.skills.map((skill, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-semibold text-lg text-gray-900">{skill.name || skill}</h3>
                        {skill.proof_url && (
                          <a
                            href={skill.proof_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-900 hover:text-primary-800 transition-colors duration-200"
                            title="View Proof"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                      {skill.description && (
                        <p className="text-gray-600 text-sm leading-relaxed">{skill.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{profile.email}</span>
                </div>
                {profile.mobile && (
                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{profile.mobile}</span>
                  </div>
                )}
                {profile.residential_address && (
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                    <span className="text-sm text-gray-600">{profile.residential_address}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Profile Views</span>
                  <span className="text-sm font-medium">
                    <CountUp end={Math.floor(Math.random() * 100) + 50} duration={2} />
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Skills Listed</span>
                  <span className="text-sm font-medium">{profile.skills?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Profile Score</span>
                  <span className="text-sm font-medium text-green-600">{profileCompletion}%</span>
                </div>
              </div>
            </div>

            {/* Professional Links */}
            {(profile.portfolio || profile.github_profile || profile.linkedin_profile) && (
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Links</h3>
                <div className="space-y-3">
                  {profile.portfolio && (
                    <a
                      href={profile.portfolio}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 group"
                    >
                      <Globe className="h-5 w-5 text-blue-600" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 group-hover:text-blue-600">Portfolio</p>
                        <p className="text-xs text-gray-500 truncate">{profile.portfolio}</p>
                      </div>
                      <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-blue-600" />
                    </a>
                  )}

                  {profile.github_profile && (
                    <a
                      href={profile.github_profile}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 group"
                    >
                      <Github className="h-5 w-5 text-gray-900" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 group-hover:text-gray-700">GitHub</p>
                        <p className="text-xs text-gray-500 truncate">{profile.github_profile}</p>
                      </div>
                      <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-gray-700" />
                    </a>
                  )}

                  {profile.linkedin_profile && (
                    <a
                      href={profile.linkedin_profile}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 group"
                    >
                      <Linkedin className="h-5 w-5 text-blue-700" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 group-hover:text-blue-700">LinkedIn</p>
                        <p className="text-xs text-gray-500 truncate">{profile.linkedin_profile}</p>
                      </div>
                      <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-blue-700" />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicProfilePage;