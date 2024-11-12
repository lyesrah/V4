import React from 'react';
import { Users, TrendingUp, Target, Calendar } from 'lucide-react';
import { useLanguageStore } from '../../store/languageStore';

interface LeadMetricsProps {
  metrics: {
    total: number;
    newLeads: number;
    qualifiedLeads: number;
    conversionRate: number;
    averageScore: number;
  };
}

export default function LeadMetrics({ metrics }: LeadMetricsProps) {
  const { t } = useLanguageStore();

  const cards = [
    {
      title: t('leads.metrics.totalLeads'),
      value: metrics.total,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: t('leads.metrics.newLeads'),
      value: metrics.newLeads,
      icon: Target,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: t('leads.metrics.qualifiedLeads'),
      value: metrics.qualifiedLeads,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: t('leads.metrics.conversionRate'),
      value: `${metrics.conversionRate.toFixed(1)}%`,
      icon: Calendar,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div key={index} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 ${card.bgColor} rounded-lg`}>
                <Icon className={`w-6 h-6 ${card.color}`} />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{card.value}</h3>
            <p className="text-gray-600 mt-1">{card.title}</p>
          </div>
        );
      })}
    </div>
  );
}