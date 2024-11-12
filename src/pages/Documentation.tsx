import React, { useState } from 'react';
import { BookOpen, Plus, Search, Menu } from 'lucide-react';
import WikiNavigation from '../components/wiki/WikiNavigation';
import WikiEditor from '../components/wiki/WikiEditor';
import WikiSearch from '../components/wiki/WikiSearch';
import CreatePageModal from '../components/wiki/CreatePageModal';

export default function Documentation() {
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState<string | undefined>();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleCreatePage = (folderId?: string) => {
    setSelectedFolderId(folderId);
    setIsCreateModalOpen(true);
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu className="w-5 h-5" />
          </button>
          <BookOpen className="w-8 h-8 text-blue-600" />
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Documentation</h1>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
          >
            <Search className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleCreatePage()}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
          >
            <Plus className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">New Page</span>
          </button>
        </div>
      </div>

      <div className="flex flex-1 gap-6 overflow-hidden bg-white rounded-xl shadow-sm border border-gray-100">
        <div className={`
          lg:w-64 border-r border-gray-200 overflow-y-auto
          ${isSidebarOpen ? 'fixed inset-0 z-40 bg-white' : 'hidden lg:block'}
        `}>
          <div className="p-4">
            {isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="lg:hidden mb-4 text-gray-500 hover:text-gray-700"
              >
                Close
              </button>
            )}
            <WikiNavigation 
              onPageSelect={(id) => {
                setSelectedPageId(id);
                setIsSidebarOpen(false);
              }}
              onCreatePage={handleCreatePage}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <WikiEditor pageId={selectedPageId} />
        </div>
      </div>

      <WikiSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <CreatePageModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        parentFolderId={selectedFolderId}
      />
    </div>
  );
}