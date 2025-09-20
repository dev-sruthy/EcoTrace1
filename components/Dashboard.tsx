
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { calculateCarbonFootprint, generateTips } from '../services/carbonService';
import { type Activities, type Emissions, type Tip } from '../types';
import { UserIcon, LogOutIcon, CarIcon, HomeIcon, UtensilsIcon, TrendingUpIcon, TargetIcon, AwardIcon } from './icons';
import EcoCoach from './EcoCoach';

const DashboardHeader: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-2">
             <svg className="h-8 w-8 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
            </svg>
            <h1 className="text-2xl font-bold text-gray-900">EcoTrace</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <UserIcon className="h-5 w-5 text-gray-500" />
              <span className="hidden sm:inline text-sm text-gray-700">Hi, {user?.name}!</span>
            </div>
            <button onClick={logout} className="flex items-center space-x-2 text-gray-500 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
              <LogOutIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

const ActivityForm: React.FC<{ activities: Activities; onActivitiesChange: (activities: Activities) => void; emissions: Emissions; }> = ({ activities, onActivitiesChange, emissions }) => {
  const total = emissions.transport + emissions.energy + emissions.food;
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 lg:p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Log Your Daily Activities</h2>
      <div className="space-y-8">
        <div>
          <div className="flex items-center mb-4"><CarIcon className="h-6 w-6 text-blue-500 mr-3" /><h3 className="text-lg font-medium text-gray-900">Transportation</h3></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Commute Method</label>
              <select value={activities.transport_method || 'car_gas'} onChange={(e) => onActivitiesChange({...activities, transport_method: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"><option value="car_gas">Gas Car</option><option value="car_hybrid">Hybrid Car</option><option value="car_electric">Electric Car</option><option value="public_transit">Public Transit</option><option value="cycling">Cycling</option><option value="walking">Walking</option></select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Daily Commute (miles, round-trip)</label>
              <input type="number" value={activities.commute_distance || ''} onChange={(e) => onActivitiesChange({...activities, commute_distance: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent" placeholder="e.g., 20" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Flights This Month</label>
              <input type="number" value={activities.flights_month || ''} onChange={(e) => onActivitiesChange({...activities, flights_month: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent" placeholder="0" />
            </div>
          </div>
        </div>
        <div>
          <div className="flex items-center mb-4"><HomeIcon className="h-6 w-6 text-orange-500 mr-3" /><h3 className="text-lg font-medium text-gray-900">Home Energy</h3></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Home Type</label>
              <select value={activities.home_type || 'small_house'} onChange={(e) => onActivitiesChange({...activities, home_type: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"><option value="apartment">Apartment</option><option value="small_house">Small House</option><option value="large_house">Large House</option></select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Primary Heating</label>
              <select value={activities.heating_type || 'gas'} onChange={(e) => onActivitiesChange({...activities, heating_type: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"><option value="gas">Natural Gas</option><option value="electric">Electric</option><option value="heat_pump">Heat Pump</option></select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Electricity Source</label>
              <select value={activities.electricity_source || 'grid'} onChange={(e) => onActivitiesChange({...activities, electricity_source: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"><option value="grid">Standard Grid</option><option value="some_renewable">Some Renewable</option><option value="mostly_renewable">Mostly Renewable</option></select>
            </div>
          </div>
        </div>
        <div>
          <div className="flex items-center mb-4"><UtensilsIcon className="h-6 w-6 text-green-500 mr-3" /><h3 className="text-lg font-medium text-gray-900">Food & Diet</h3></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Diet Type</label>
              <select value={activities.diet_type || 'moderate_meat'} onChange={(e) => onActivitiesChange({...activities, diet_type: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"><option value="meat_heavy">Meat Heavy</option><option value="moderate_meat">Moderate Meat</option><option value="vegetarian">Vegetarian</option><option value="vegan">Vegan</option></select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Meal Preparation</label>
              <select value={activities.meal_ratio || 'mostly_home'} onChange={(e) => onActivitiesChange({...activities, meal_ratio: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"><option value="mostly_home">Mostly Home Cooked</option><option value="half_half">Half & Half</option><option value="mostly_out">Mostly Eating Out</option></select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Food Waste Level</label>
              <select value={activities.food_waste || 'medium'} onChange={(e) => onActivitiesChange({...activities, food_waste: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h4 className="font-semibold text-gray-900 mb-2">Today's Estimated Carbon Footprint</h4>
        <div className="text-3xl font-bold text-gray-900 mb-2">{total.toFixed(1)} kg CO₂e</div>
        <div className="text-sm text-gray-600">Transport: {emissions.transport.toFixed(1)} kg • Energy: {emissions.energy.toFixed(1)} kg • Food: {emissions.food.toFixed(1)} kg</div>
      </div>
    </div>
  );
};

const ResultsDashboard: React.FC<{ emissions: Emissions; tips: Tip[]; activities: Activities; }> = ({ emissions, tips, activities }) => {
  const total = emissions.transport + emissions.energy + emissions.food;
  const averageDaily = 44;
  const getFootprintLevel = useCallback(() => {
    if (total === 0) return { level: 'Not Calculated', color: 'text-gray-600' };
    if (total < 20) return { level: 'Excellent', color: 'text-green-600' };
    if (total < 35) return { level: 'Good', color: 'text-blue-600' };
    if (total < 50) return { level: 'Average', color: 'text-yellow-600' };
    return { level: 'High', color: 'text-red-600' };
  }, [total]);
  const footprintLevel = getFootprintLevel();
  const breakdownData = [
    { name: 'Transport', value: emissions.transport, color: 'bg-blue-500' },
    { name: 'Energy', value: emissions.energy, color: 'bg-orange-500' },
    { name: 'Food', value: emissions.food, color: 'bg-green-500' }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6 flex items-center space-x-4"><div className="bg-blue-100 p-3 rounded-full"><TrendingUpIcon className="h-8 w-8 text-blue-500" /></div><div><p className="text-sm font-medium text-gray-600">Today's Footprint</p><p className="text-2xl font-bold text-gray-900">{total.toFixed(1)} kg</p></div></div>
        <div className="bg-white rounded-lg shadow-lg p-6 flex items-center space-x-4"><div className="bg-green-100 p-3 rounded-full"><TargetIcon className="h-8 w-8 text-green-500" /></div><div><p className="text-sm font-medium text-gray-600">vs. US Average</p><p className={`text-2xl font-bold ${total > 0 && total < averageDaily ? 'text-green-600' : 'text-red-600'}`}>{total > 0 ? `${total < averageDaily ? '−' : '+'}${Math.abs(total - averageDaily).toFixed(1)} kg` : 'N/A'}</p></div></div>
        <div className="bg-white rounded-lg shadow-lg p-6 flex items-center space-x-4"><div className="bg-purple-100 p-3 rounded-full"><AwardIcon className="h-8 w-8 text-purple-500" /></div><div><p className="text-sm font-medium text-gray-600">Impact Level</p><p className={`text-xl font-bold ${footprintLevel.color}`}>{footprintLevel.level}</p></div></div>
      </div>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Emissions Breakdown</h3>
        <div className="space-y-4">
          {breakdownData.map((item) => (
            <div key={item.name} className="flex items-center">
              <div className="w-24 text-sm text-gray-600 font-medium">{item.name}</div>
              <div className="flex-1 mx-4">
                <div className="bg-gray-200 rounded-full h-4 overflow-hidden">
                  <div className={`${item.color} h-4 rounded-full transition-all duration-500 ease-out`} style={{ width: `${total > 0 ? (item.value / total) * 100 : 0}%` }} />
                </div>
              </div>
              <div className="w-20 text-sm font-medium text-gray-900 text-right">{item.value.toFixed(1)} kg</div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Personalized Tips for You</h3>
        <div className="space-y-4">
          {tips.map((tip, index) => (
            <div key={index} className="border-l-4 border-green-500 pl-4 py-2 bg-green-50 rounded-r-lg">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-gray-900">{tip.tip}</p>
                  <p className="text-sm text-gray-600 mt-1">Impact: {tip.impact} • Difficulty: {tip.difficulty}</p>
                </div>
                <span className="text-xs px-2 py-1 bg-green-200 text-green-800 rounded-full font-semibold ml-2">{tip.category}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <EcoCoach activities={activities} emissions={emissions} />
    </div>
  );
};

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activities>(() => {
    if (user) {
      const saved = localStorage.getItem(`ecotrace_activities_${user.uid}`);
      return saved ? JSON.parse(saved) : {};
    }
    return {};
  });

  const emissions = calculateCarbonFootprint(activities);
  const tips = generateTips(activities, emissions);

  useEffect(() => {
    if (user) {
      localStorage.setItem(`ecotrace_activities_${user.uid}`, JSON.stringify(activities));
    }
  }, [activities, user]);

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <main className="max-w-7xl mx-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <ActivityForm activities={activities} onActivitiesChange={setActivities} emissions={emissions} />
          <ResultsDashboard emissions={emissions} tips={tips} activities={activities} />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
