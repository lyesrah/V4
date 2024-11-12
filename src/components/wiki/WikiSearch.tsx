import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { useWikiStore } from '../../store/wikiStore';

interface WikiSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WikiSearch({ isOpen, onClose }: WikiSearchProps) {
  const [query, setQuery] = useState('');
  const { searchPages } = useWikiStore();
  const results = searchPages(query);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="p-4 border-b">
          <div className="flex items-center space-x-3">
            <Search className="w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 outline-none"
              placeholder="Rechercher dans la documentation..."
              autoFocus
            />
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full transition"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {query && (
          <div className="max-h-96 overflow-y-auto p-2">
            {results.map((result) => (
              <div
                key={result.id}
                className="p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
              >
                <div className="font-medium text-gray-900">{result.title}</div>
                <div className="text-sm text-gray-500 truncate">
                  {result.content}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}