import React from 'react';
import { ChevronRight, ChevronDown, File, Folder, Plus } from 'lucide-react';
import { useWikiStore } from '../../store/wikiStore';

interface WikiNavigationProps {
  onPageSelect: (pageId: string) => void;
  onCreatePage: (folderId?: string) => void;
}

export default function WikiNavigation({ onPageSelect, onCreatePage }: WikiNavigationProps) {
  const { pages, folders } = useWikiStore();

  const renderItem = (item: any, depth = 0) => {
    const isFolder = 'children' in item;
    const Icon = isFolder ? Folder : File;
    
    return (
      <div key={item.id} style={{ paddingLeft: `${depth * 1.5}rem` }}>
        <div
          className="flex items-center space-x-2 px-2 py-1.5 rounded-lg hover:bg-gray-100 cursor-pointer group"
          onClick={() => !isFolder && onPageSelect(item.id)}
        >
          <Icon className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-700 flex-1">{item.title}</span>
          {isFolder && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onCreatePage(item.id);
              }}
              className="invisible group-hover:visible p-1 hover:bg-gray-200 rounded"
            >
              <Plus className="w-3 h-3 text-gray-500" />
            </button>
          )}
        </div>
        {isFolder && item.children.map((child: any) => renderItem(child, depth + 1))}
      </div>
    );
  };

  return (
    <div className="space-y-1">
      {folders.map(folder => renderItem(folder))}
      {pages.filter(page => !page.folderId).map(page => renderItem(page))}
    </div>
  );
}