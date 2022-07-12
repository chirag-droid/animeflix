import React, { SVGProps } from 'react';

export interface IconProps {
  icon: React.FC<SVGProps<SVGElement>>;
  text: string;
  className?: string;
}

const Icon: React.FC<IconProps> = ({ icon, text, className }) => {
  const HeroIcon = icon;
  return (
    <div className={`flex items-center space-x-1 ${className || ''}`}>
      <HeroIcon className="h-4 w-4" />
      <p className="text-xs sm:text-sm">{text}</p>
    </div>
  );
};

export default Icon;
