import { Building, Globe, Users } from 'lucide-react';

const CompanyCard = ({ company, onClick }) => {
  return (
    <div 
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-6 cursor-pointer border border-gray-200 hover:border-primary-900"
      onClick={() => onClick && onClick(company.id)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <Building className="h-8 w-8 text-primary-900 mr-3" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{company.name}</h3>
            {company.industry && (
              <p className="text-sm text-gray-600">{company.industry}</p>
            )}
          </div>
        </div>
      </div>

      {company.description && (
        <p className="text-gray-700 mb-4 line-clamp-3">{company.description}</p>
      )}

      <div className="space-y-2">
        {company.website && (
          <div className="flex items-center text-sm text-gray-600">
            <Globe className="h-4 w-4 mr-2" />
            <a 
              href={company.website}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary-900 transition-colors duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              {company.website}
            </a>
          </div>
        )}
        
        {company.employees && (
          <div className="flex items-center text-sm text-gray-600">
            <Users className="h-4 w-4 mr-2" />
            <span>{company.employees} employees</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyCard;