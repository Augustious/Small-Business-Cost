import React from 'react';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center py-4">
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            {title}
          </h1>
        </div>
      </div>
    </header>
  );
};

export default Header;