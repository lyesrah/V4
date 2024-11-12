import React, { useState } from 'react';
import { X, FolderTree, File } from 'lucide-react';
import { useWikiStore } from '../../store/wikiStore';

interface CreatePageModalProps {
  isOpen: boolean;
  onClose: () => void;
  parentFolderId?: string | null;
}

export default function CreatePageModal({ isOpen, onClose, parentFolderId }: CreatePageModalProps) {
  const [title, setTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const { createPage } = useWikiStore();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsCreating(true);
    try {
      await createPage({
        title: title.trim(),
        content: '',
        folderId: parentFolderId || null,
      });
      onClose();
      setTitle('');
    } catch (error) {
      console.error('Error creating page:', error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-medium text-gray-900">Nouvelle page</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Titre de la page
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
              placeholder="Entrez le titre de la page"
              autoFocus
            />
          </div>

          {parentFolderId ? (
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <FolderTree className="w-4 h-4" />
              <span>Cette page sera créée dans le dossier sélectionné</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <File className="w-4 h-4" />
              <span>Cette page sera créée à la racine</span>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={!title.trim() || isCreating}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
            >
              {isCreating ? 'Création...' : 'Créer la page'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}