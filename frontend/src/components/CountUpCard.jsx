import { useEffect, useState } from 'react';
import CountUp from 'react-countup';

const CountUpCard = ({ 
  title, 
  value, 
  icon: Icon, 
  color = 'blue',
  suffix = '',
  duration = 2
}) => {
  const [startAnimation, setStartAnimation] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setStartAnimation(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const colorClasses = {
    blue: {
      bg: 'bg-blue-100',
      text: 'text-blue-600',
      border: 'border-blue-100'
    },
    green: {
      bg: 'bg-green-100',
      text: 'text-green-600',
      border: 'border-green-100'
    },
    purple: {
      bg: 'bg-purple-100',
      text: 'text-purple-600',
      border: 'border-purple-100'
    },
    orange: {
      bg: 'bg-orange-100',
      text: 'text-orange-600',
      border: 'border-orange-100'
    },
    red: {
      bg: 'bg-red-100',
      text: 'text-red-600',
      border: 'border-red-100'
    },
    yellow: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-600',
      border: 'border-yellow-100'
    }
  };

  const colors = colorClasses[color] || colorClasses.blue;

  return (
    <div className={`bg-white rounded-2xl shadow-lg p-6 border ${colors.border} hover:shadow-xl transition-all duration-300 transform hover:scale-105`}>
      <div className="flex items-center">
        <div className={`${colors.bg} p-3 rounded-xl`}>
          <Icon className={`h-8 w-8 ${colors.text}`} />
        </div>
        <div className="ml-4">
          <p className="text-sm text-gray-600 font-medium">{title}</p>
          <p className="text-3xl font-bold text-primary-900">
            {startAnimation ? (
              <CountUp
                start={0}
                end={value}
                duration={duration}
                suffix={suffix}
              />
            ) : (
              '0'
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CountUpCard;