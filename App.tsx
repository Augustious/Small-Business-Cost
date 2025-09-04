import React, { useState, useMemo } from 'react';
import { useCosts } from './hooks/useCosts';
import type { Cost, Suggestion } from './types';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import CostTable from './components/CostTable';
import CostFormModal from './components/CostFormModal';
import SuggestionModal from './components/SuggestionModal';
import BottomNavBar from './components/BottomNavBar';
import { generateSuggestions } from './services/geminiService';

type View = 'dashboard' | 'costs';

const App: React.FC = () => {
  const { costs, addCost, updateCost, deleteCost } = useCosts();
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingCost, setEditingCost] = useState<Cost | null>(null);
  const [isSuggestionModalOpen, setIsSuggestionModalOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestionError, setSuggestionError] = useState<string | null>(null);
  const [costToAnalyze, setCostToAnalyze] = useState<Cost | null>(null);

  const handleAddNew = () => {
    setEditingCost(null);
    setIsFormModalOpen(true);
  };

  const handleEdit = (cost: Cost) => {
    setEditingCost(cost);
    setIsFormModalOpen(true);
  };

  const handleSaveCost = (cost: Cost) => {
    if (editingCost) {
      updateCost(cost);
    } else {
      addCost(cost);
    }
    setIsFormModalOpen(false);
    setEditingCost(null);
  };

  const handleAnalyze = async (cost: Cost) => {
    setCostToAnalyze(cost);
    setIsSuggestionModalOpen(true);
    setIsGenerating(true);
    setSuggestionError(null);
    setSuggestions([]);
    try {
      const result = await generateSuggestions(cost);
      setSuggestions(result);
    } catch (error) {
      console.error("Failed to generate suggestions:", error);
      setSuggestionError("Sorry, I couldn't generate suggestions at this time. Please try again later.");
    } finally {
      setIsGenerating(false);
    }
  };
  
  const upcomingRenewals = useMemo(() => {
    // Get today's date at midnight in the user's local timezone.
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const thirtyDaysFromNow = new Date(today);
    thirtyDaysFromNow.setDate(today.getDate() + 30);

    return costs
      .filter(cost => {
        // The renewal date string from the input is "YYYY-MM-DD".
        // new Date("YYYY-MM-DD") creates a Date object at midnight UTC.
        // To prevent timezone-related issues where UTC midnight might be the previous
        // day in the user's local timezone, we manually parse the date parts.
        // This constructs a Date object at midnight in the local timezone.
        const [year, month, day] = cost.renewalDate.split('-').map(Number);
        const renewalDate = new Date(year, month - 1, day);
        return renewalDate >= today && renewalDate <= thirtyDaysFromNow;
      })
      .sort((a, b) => {
        // Also ensure sorting is based on the same consistent parsing logic.
        const [yearA, monthA, dayA] = a.renewalDate.split('-').map(Number);
        const dateA = new Date(yearA, monthA - 1, dayA);
        const [yearB, monthB, dayB] = b.renewalDate.split('-').map(Number);
        const dateB = new Date(yearB, monthB - 1, dayB);
        return dateA.getTime() - dateB.getTime();
      });
  }, [costs]);

  const viewTitle = activeView === 'dashboard' ? 'Dashboard' : 'All Costs';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-24">
      <Header title={viewTitle} />
      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {activeView === 'dashboard' && <Dashboard costs={costs} upcomingRenewals={upcomingRenewals} />}
        {activeView === 'costs' && (
          <CostTable 
            costs={costs} 
            onEdit={handleEdit} 
            onDelete={deleteCost} 
            onAnalyze={handleAnalyze} 
          />
        )}
      </main>
      
      <BottomNavBar 
        activeView={activeView}
        onNavigate={setActiveView}
        onAddNew={handleAddNew}
      />

      {isFormModalOpen && (
        <CostFormModal
          isOpen={isFormModalOpen}
          onClose={() => setIsFormModalOpen(false)}
          onSave={handleSaveCost}
          cost={editingCost}
        />
      )}
      
      {isSuggestionModalOpen && (
        <SuggestionModal
          isOpen={isSuggestionModalOpen}
          onClose={() => setIsSuggestionModalOpen(false)}
          suggestions={suggestions}
          isLoading={isGenerating}
          error={suggestionError}
          cost={costToAnalyze}
        />
      )}

    </div>
  );
};

export default App;