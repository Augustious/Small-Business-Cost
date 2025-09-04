import { useState, useEffect, useCallback } from 'react';
import type { Cost } from '../types';

const STORAGE_KEY = 'recurring-costs';
const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export const useCosts = () => {
  const [costs, setCosts] = useState<Cost[]>([]);

  useEffect(() => {
    try {
      const storedCosts = localStorage.getItem(STORAGE_KEY);
      if (storedCosts) {
        setCosts(JSON.parse(storedCosts));
      }
    } catch (error) {
      console.error("Failed to load costs from localStorage", error);
    }
  }, []);

  const saveCosts = (newCosts: Cost[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newCosts));
      setCosts(newCosts);
    } catch (error) {
      console.error("Failed to save costs to localStorage", error);
    }
  };

  const addCost = useCallback((cost: Cost) => {
    if (!ISO_DATE_REGEX.test(cost.renewalDate)) {
      console.error(`Invalid date format for new cost "${cost.name}". Expected YYYY-MM-DD, but got "${cost.renewalDate}".`);
      // The form's date input should prevent this, but this adds a layer of robustness.
    }
    const newCosts = [...costs, cost];
    saveCosts(newCosts);
  }, [costs]);

  const updateCost = useCallback((updatedCost: Cost) => {
    if (!ISO_DATE_REGEX.test(updatedCost.renewalDate)) {
      console.error(`Invalid date format for updated cost "${updatedCost.name}". Expected YYYY-MM-DD, but got "${updatedCost.renewalDate}".`);
    }
    const newCosts = costs.map(cost => (cost.id === updatedCost.id ? updatedCost : cost));
    saveCosts(newCosts);
  }, [costs]);

  const deleteCost = useCallback((id: string) => {
    if(window.confirm('Are you sure you want to delete this cost?')) {
        const newCosts = costs.filter(cost => cost.id !== id);
        saveCosts(newCosts);
    }
  }, [costs]);

  return { costs, addCost, updateCost, deleteCost };
};