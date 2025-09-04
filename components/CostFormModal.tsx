
import React, { useState, useEffect } from 'react';
import type { Cost } from '../types';
import { CostCategory, BillingCycle } from '../types';
import { XIcon } from './icons/Icons';

interface CostFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (cost: Cost) => void;
  cost: Cost | null;
}

const CostFormModal: React.FC<CostFormModalProps> = ({ isOpen, onClose, onSave, cost }) => {
  const [formData, setFormData] = useState<Omit<Cost, 'id'>>({
    name: '',
    category: CostCategory.OTHER,
    cost: 0,
    billingCycle: BillingCycle.MONTHLY,
    renewalDate: '',
  });

  useEffect(() => {
    if (cost) {
      setFormData({
        name: cost.name,
        category: cost.category,
        cost: cost.cost,
        billingCycle: cost.billingCycle,
        renewalDate: cost.renewalDate,
      });
    } else {
      setFormData({
        name: '',
        category: CostCategory.OTHER,
        cost: 0,
        billingCycle: BillingCycle.MONTHLY,
        renewalDate: new Date().toISOString().split('T')[0],
      });
    }
  }, [cost, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'cost' ? parseFloat(value) : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: cost?.id || crypto.randomUUID(),
      ...formData,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md m-4" onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">{cost ? 'Edit Cost' : 'Add New Cost'}</h2>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
              <XIcon className="h-6 w-6" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700">Service Name</label>
              <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-slate-700">Category</label>
              <select name="category" id="category" value={formData.category} onChange={handleChange} className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                {Object.values(CostCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="cost" className="block text-sm font-medium text-slate-700">Cost (USD)</label>
                <input type="number" name="cost" id="cost" value={formData.cost} onChange={handleChange} required min="0" step="0.01" className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>
              <div>
                <label htmlFor="billingCycle" className="block text-sm font-medium text-slate-700">Billing Cycle</label>
                <select name="billingCycle" id="billingCycle" value={formData.billingCycle} onChange={handleChange} className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                  {Object.values(BillingCycle).map(cycle => <option key={cycle} value={cycle}>{cycle}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="renewalDate" className="block text-sm font-medium text-slate-700">Next Renewal Date</label>
              <input type="date" name="renewalDate" id="renewalDate" value={formData.renewalDate} onChange={handleChange} required className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <button type="button" onClick={onClose} className="px-4 py-2 border border-slate-300 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Cancel</button>
              <button type="submit" className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">{cost ? 'Save Changes' : 'Add Cost'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CostFormModal;
