
import React, { useMemo } from 'react';
import type { Cost } from '../types';
import { CostCategory, BillingCycle } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { AlertIcon, CalendarIcon, DollarSignIcon } from './icons/Icons';

interface DashboardProps {
  costs: Cost[];
  upcomingRenewals: Cost[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#ff4d4d'];

const Dashboard: React.FC<DashboardProps> = ({ costs, upcomingRenewals }) => {
  const { totalMonthly, totalAnnual, categoryData } = useMemo(() => {
    let monthlyTotal = 0;
    const categoryTotals: { [key in CostCategory]: number } = {
      [CostCategory.CLOUD]: 0,
      [CostCategory.MARKETING]: 0,
      [CostCategory.DOMAINS]: 0,
      [CostCategory.ADS]: 0,
      [CostCategory.OFFICE]: 0,
      [CostCategory.OTHER]: 0,
    };

    costs.forEach(cost => {
      const monthlyCost = cost.billingCycle === BillingCycle.ANNUALLY ? cost.cost / 12 : cost.cost;
      monthlyTotal += monthlyCost;
      categoryTotals[cost.category] += monthlyCost;
    });

    const categoryData = Object.entries(categoryTotals)
      .map(([name, value]) => ({ name, value: parseFloat(value.toFixed(2)) }))
      .filter(item => item.value > 0);

    return {
      totalMonthly: monthlyTotal,
      totalAnnual: monthlyTotal * 12,
      categoryData,
    };
  }, [costs]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-slate-700 mb-4">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Key Metrics */}
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center gap-4">
          <div className="bg-green-100 p-3 rounded-full"><DollarSignIcon className="h-6 w-6 text-green-600" /></div>
          <div>
            <p className="text-sm text-slate-500">Total Monthly Cost</p>
            <p className="text-2xl font-bold text-slate-800">{formatCurrency(totalMonthly)}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center gap-4">
          <div className="bg-blue-100 p-3 rounded-full"><CalendarIcon className="h-6 w-6 text-blue-600" /></div>
          <div>
            <p className="text-sm text-slate-500">Total Annual Cost</p>
            <p className="text-2xl font-bold text-slate-800">{formatCurrency(totalAnnual)}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center gap-4">
          <div className="bg-orange-100 p-3 rounded-full"><AlertIcon className="h-6 w-6 text-orange-600" /></div>
          <div>
            <p className="text-sm text-slate-500">Upcoming Renewals (30d)</p>
            <p className="text-2xl font-bold text-slate-800">{upcomingRenewals.length}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Cost Breakdown Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <h3 className="font-semibold text-slate-700 mb-4">Cost Breakdown by Category</h3>
          {costs.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                    return (
                      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize="12">
                        {`${(percent * 100).toFixed(0)}%`}
                      </text>
                    );
                  }}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
             <div className="h-[300px] flex items-center justify-center text-slate-500">Add a cost to see your breakdown.</div>
          )}
        </div>

        {/* Upcoming Renewals List */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="font-semibold text-slate-700 mb-4">Upcoming Renewals</h3>
          {upcomingRenewals.length > 0 ? (
            <ul className="space-y-3">
              {upcomingRenewals.map(cost => (
                <li key={cost.id} className="flex justify-between items-center text-sm">
                  <span className="font-medium text-slate-600">{cost.name}</span>
                  <span className="text-slate-500">{new Date(cost.renewalDate).toLocaleDateString()}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-500">No renewals in the next 30 days.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
