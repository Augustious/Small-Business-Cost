import React from 'react';
import { DashboardIcon, ListIcon, PlusIcon } from './icons/Icons';

type View = 'dashboard' | 'costs';

interface BottomNavBarProps {
  activeView: View;
  onNavigate: (view: View) => void;
  onAddNew: () => void;
}

const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeView, onNavigate, onAddNew }) => {
  const navItemClasses = "flex flex-col items-center justify-center w-full h-full transition-colors duration-200";
  const activeNavItemClasses = "text-indigo-600";
  const inactiveNavItemClasses = "text-slate-500 hover:text-indigo-500";
  const iconClasses = "h-6 w-6 mb-1";
  const labelClasses = "text-xs font-medium";

  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-200 shadow-[0_-1px_4px_rgba(0,0,0,0.05)] z-20">
      <div className="max-w-7xl mx-auto h-full flex justify-around items-center px-2">
        <button 
          onClick={() => onNavigate('dashboard')} 
          className={`${navItemClasses} ${activeView === 'dashboard' ? activeNavItemClasses : inactiveNavItemClasses}`}
          aria-label="Dashboard"
        >
          <DashboardIcon className={iconClasses} />
          <span className={labelClasses}>Dashboard</span>
        </button>

        <div className="w-1/3 flex justify-center">
            <button 
              onClick={onAddNew} 
              className="bg-indigo-600 text-white rounded-full h-14 w-14 flex items-center justify-center shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition -mt-6"
              aria-label="Add New Cost"
            >
              <PlusIcon className="h-7 w-7" />
            </button>
        </div>

        <button 
          onClick={() => onNavigate('costs')} 
          className={`${navItemClasses} ${activeView === 'costs' ? activeNavItemClasses : inactiveNavItemClasses}`}
          aria-label="All Costs"
        >
          <ListIcon className={iconClasses} />
          <span className={labelClasses}>All Costs</span>
        </button>
      </div>
    </div>
  );
};

export default BottomNavBar;