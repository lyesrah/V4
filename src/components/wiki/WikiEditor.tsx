import React, { useState, useEffect } from 'react';
import { useWikiStore } from '../../store/wikiStore';
import { Save, Bold, Italic, List, Heading, Link as LinkIcon } from 'lucide-react';

interface WikiEditorProps {
  pageId: string | null;
}

export default function WikiEditor({ pageId }: WikiEditorProps) {
  const { getPage, updatePage } = useWikiStore();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [autoSaveTimeout, setAutoSaveTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (pageId) {
      const page = getPage(pageId);
      if (page) {
        setTitle(page.title);
        setContent(page.content);
      }
    }
  }, [pageId, getPage]);

  useEffect(() => {
    const handleAutoSave = async () => {
      if (pageId && title.trim()) {
        try {
          await updatePage(pageId, {
            title,
            content
          });
        } catch (error) {
          console.error('Auto-save failed:', error);
        }
      }
    };

    if (autoSaveTimeout) {
      clearTimeout(autoSaveTimeout);
    }

    setAutoSaveTimeout(setTimeout(handleAutoSave, 2000));

    return () => {
      if (autoSaveTimeout) {
        clearTimeout(autoSaveTimeout);
      }
    };
  }, [title, content, pageId, updatePage]);

  const handleSave = async () => {
    if (!pageId) return;
    
    setIsSaving(true);
    try {
      await updatePage(pageId, {
        title,
        content
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!pageId) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500 p-4">
        <div className="text-center">
          <h3 className="text-lg font-medium mb-2">Welcome to the Wiki</h3>
          <p className="text-sm">Select a page to start editing or create a new one</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border-b">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-xl sm:text-2xl font-bold text-gray-900 bg-transparent border-0 outline-none focus:ring-0 w-full sm:w-auto"
          placeholder="Page Title"
        />
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 w-full sm:w-auto justify-center"
        >
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? 'Saving...' : 'Save'}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto bg-white">
        <div className="flex flex-wrap gap-1 border-b border-gray-200 p-2">
          <button
            onClick={() => {
              const textarea = document.getElementById('content-editor') as HTMLTextAreaElement;
              const start = textarea.selectionStart;
              const end = textarea.selectionEnd;
              const text = textarea.value;
              const before = text.substring(0, start);
              const selection = text.substring(start, end);
              const after = text.substring(end);
              setContent(`${before}**${selection}**${after}`);
            }}
            className="p-2 rounded hover:bg-gray-100"
            title="Bold"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              const textarea = document.getElementById('content-editor') as HTMLTextAreaElement;
              const start = textarea.selectionStart;
              const end = textarea.selectionEnd;
              const text = textarea.value;
              const before = text.substring(0, start);
              const selection = text.substring(start, end);
              const after = text.substring(end);
              setContent(`${before}_${selection}_${after}`);
            }}
            className="p-2 rounded hover:bg-gray-100"
            title="Italic"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              const textarea = document.getElementById('content-editor') as HTMLTextAreaElement;
              const start = textarea.selectionStart;
              const text = textarea.value;
              const before = text.substring(0, start);
              const after = text.substring(start);
              setContent(`${before}\n- ${after}`);
            }}
            className="p-2 rounded hover:bg-gray-100"
            title="Bullet List"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              const textarea = document.getElementById('content-editor') as HTMLTextAreaElement;
              const start = textarea.selectionStart;
              const text = textarea.value;
              const before = text.substring(0, start);
              const after = text.substring(start);
              setContent(`${before}\n## ${after}`);
            }}
            className="p-2 rounded hover:bg-gray-100"
            title="Heading"
          >
            <Heading className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              const url = window.prompt('Enter URL:');
              if (url) {
                const textarea = document.getElementById('content-editor') as HTMLTextAreaElement;
                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;
                const text = textarea.value;
                const before = text.substring(0, start);
                const selection = text.substring(start, end);
                const after = text.substring(end);
                setContent(`${before}[${selection}](${url})${after}`);
              }
            }}
            className="p-2 rounded hover:bg-gray-100"
            title="Add Link"
          >
            <LinkIcon className="w-4 h-4" />
          </button>
        </div>
        <div className="max-w-4xl mx-auto p-4">
          <textarea
            id="content-editor"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-[calc(100vh-16rem)] p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            placeholder="Write your content here... (Markdown supported)"
          />
        </div>
      </div>
    </div>
  );
}