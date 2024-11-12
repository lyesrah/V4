import React from 'react';
import { Building2 } from 'lucide-react';

export default function Logo() {
  return (
    <div className="flex items-center space-x-2">
      <div className="relative">
        <Building2 className="w-8 h-8 text-blue-600" />
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white" />
      </div>
      <div>
        <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
          Alta
        </span>
        <span className="text-xl font-light text-gray-700">Rent</span>
      </div>
    </div>
  );
}