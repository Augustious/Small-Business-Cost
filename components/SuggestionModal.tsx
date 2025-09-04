
import React from 'react';
import type { Suggestion, Cost } from '../types';
import { SparklesIcon, XIcon, AlertTriangleIcon } from './icons/Icons';

interface SuggestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  suggestions: Suggestion[];
  isLoading: boolean;
  error: string | null;
  cost: Cost | null;
}

const SuggestionModal: React.FC<SuggestionModalProps> = ({ isOpen, onClose, suggestions, isLoading, error, cost }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg m-4" onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <SparklesIcon className="h-6 w-6 text-indigo-500" />
                <span>Optimization Suggestions</span>
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                AI-powered alternatives for <span className="font-semibold text-slate-700">{cost?.name}</span>
              </p>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
              <XIcon className="h-6 w-6" />
            </button>
          </div>
          
          <div className="mt-4 max-h-[60vh] overflow-y-auto pr-2">
            {isLoading && (
              <div className="flex flex-col items-center justify-center text-center p-8 space-y-3">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                <p className="text-slate-600 font-medium">Analyzing alternatives...</p>
                <p className="text-sm text-slate-500">This may take a few moments.</p>
              </div>
            )}
            
            {error && (
              <div className="flex flex-col items-center justify-center text-center p-8 bg-red-50 rounded-lg">
                <AlertTriangleIcon className="h-10 w-10 text-red-500 mb-3"/>
                <p className="text-red-700 font-semibold">An Error Occurred</p>
                <p className="text-sm text-red-600 mt-1">{error}</p>
              </div>
            )}

            {!isLoading && !error && suggestions.length > 0 && (
              <ul className="space-y-4">
                {suggestions.map((suggestion, index) => (
                  <li key={index} className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-md text-slate-800">{suggestion.alternativeName}</h3>
                      <p className="text-green-600 font-bold text-md">{suggestion.estimatedCost}</p>
                    </div>
                    <p className="text-sm text-slate-600 mt-2">{suggestion.reason}</p>
                  </li>
                ))}
              </ul>
            )}

             {!isLoading && !error && suggestions.length === 0 && (
              <div className="text-center p-8 text-slate-500">
                <p>No suggestions were found for this service.</p>
              </div>
            )}
          </div>

          <div className="flex justify-end pt-6">
            <button onClick={onClose} className="px-4 py-2 border border-slate-300 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuggestionModal;
