import React from 'react';
import { Flame, ThumbsUp, Snowflake, AlertTriangle, XCircle } from 'lucide-react';
import { useLanguageStore } from '../../store/languageStore';

export default function ProspectRating() {
  const { t } = useLanguageStore();

  const ratings = [
    { icon: Flame, count: 10, label: t('leads.rating.hot'), color: 'text-red-500' },
    { icon: ThumbsUp, count: 2, label: t('leads.rating.warm'), color: 'text-yellow-500' },
    { icon: Snowflake, count: 1, label: t('leads.rating.cold'), color: 'text-blue-500' },
    { icon: AlertTriangle, count: 0, label: t('leads.rating.atRisk'), color: 'text-orange-500' },
    { icon: XCircle, count: 0, label: t('leads.rating.lost'), color: 'text-gray-500' }
  ];

  return (
    <div className="flex items-center justify-between">
      {ratings.map((rating, index) => (
        <div key={index} className="text-center">
          <rating.icon className={`w-6 h-6 ${rating.color} mx-auto`} />
          <div className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
            {rating.count}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {rating.label}
          </div>
        </div>
      ))}
    </div>
  );
}