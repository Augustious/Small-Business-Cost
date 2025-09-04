import React from 'react';
import type { Cost } from '../types';
import { BillingCycle } from '../types';
import { EditIcon, TrashIcon, SparklesIcon } from './icons/Icons';

interface CostTableProps {
  costs: Cost[];
  onEdit: (cost: Cost) => void;
  onDelete: (id: string) => void;
  onAnalyze: (cost: Cost) => void;
}

const CostTable: React.FC<CostTableProps> = ({ costs, onEdit, onDelete, onAnalyze }) => {

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };
  
  return (
    <div className="space-y-4">
       {costs.length > 0 ? costs.map((cost) => (
        <div key={cost.id} className="bg-white p-4 rounded-lg shadow-md transition-shadow hover:shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-bold text-slate-800 text-lg">{cost.name}</h4>
              <span className="mt-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-cyan-100 text-cyan-800">
                {cost.category}
              </span>
            </div>
            <div className="text-right flex-shrink-0 ml-4">
              <p className="font-bold text-lg text-slate-900">{formatCurrency(cost.cost)}</p>
              <p className="text-xs text-slate-500">
                {cost.billingCycle === BillingCycle.MONTHLY ? 'per month' : 'per year'}
              </p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-200 flex justify-between items-center">
            <p className="text-sm text-slate-600">
              <span className="font-medium">Renews:</span> {new Date(cost.renewalDate).toLocaleDateString()}
            </p>
            <div className="flex items-center justify-end gap-1">
              <button 
                onClick={() => onAnalyze(cost)} 
                className="text-indigo-600 hover:bg-indigo-100 rounded-full transition-colors p-2" 
                title="Get Optimization Suggestions"
                aria-label="Get Optimization Suggestions"
              >
                <SparklesIcon className="h-5 w-5" />
              </button>
              <button 
                onClick={() => onEdit(cost)} 
                className="text-slate-500 hover:bg-slate-200 rounded-full transition-colors p-2" 
                title="Edit Cost"
                aria-label="Edit Cost"
              >
                <EditIcon className="h-5 w-5" />
              </button>
              <button 
                onClick={() => onDelete(cost.id)} 
                className="text-red-500 hover:bg-red-100 rounded-full transition-colors p-2" 
                title="Delete Cost"
                aria-label="Delete Cost"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )) : (
        <div className="text-center py-16 text-slate-500 bg-white rounded-lg shadow-md">
          <p className="font-semibold">No costs added yet.</p>
          <p className="text-sm mt-1">Tap the '+' button below to get started.</p>
        </div>
      )}
    </div>
  );
};

export default CostTable;