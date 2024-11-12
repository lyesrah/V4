import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { useLeadStore } from '../../store/leadStore';
import ProspectRating from './ProspectRating';

export default function LeadOverview() {
  const { getTotalLeads, getLeadMetrics } = useLeadStore();
  const metrics = getLeadMetrics();

  const stats = [
    {
      title: 'Total Leads',
      value: getTotalLeads(),
      change: '+0.01%',
      trend: 'up',
      timeframe: 'vs last month'
    },
    {
      title: 'Total Prospects',
      value: '132',
      change: '0.0%',
      trend: 'neutral',
      timeframe: 'vs last month'
    },
    {
      title: 'Conversion Rate',
      value: '4.2%',
      change: '-0.1%',
      trend: 'down',
      timeframe: 'vs last month'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow-sm p-6 dark:bg-gray-800"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {stat.title}
            </h3>
            <span className={`text-sm font-medium flex items-center ${
              stat.trend === 'up' ? 'text-green-600' :
              stat.trend === 'down' ? 'text-red-600' :
              'text-gray-600'
            }`}>
              {stat.trend === 'up' && <ArrowUp className="w-4 h-4 mr-1" />}
              {stat.trend === 'down' && <ArrowDown className="w-4 h-4 mr-1" />}
              {stat.change}
            </span>
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
            {stat.value}
          </p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {stat.timeframe}
          </p>
        </div>
      ))}

      <div className="bg-white rounded-xl shadow-sm p-6 dark:bg-gray-800">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
          Prospect Rating
        </h3>
        <ProspectRating />
      </div>
    </div>
  );
}