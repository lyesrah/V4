import React from 'react';
import { X, Plus, Search } from 'lucide-react';
import { Client } from '../../store/clientStore';

interface SelectClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (clientId: string) => void;
  onCreateNew: () => void;
  clients: Client[];
}

export default function SelectClientModal({
  isOpen,
  onClose,
  onSelect,
  onCreateNew,
  clients
}: SelectClientModalProps) {
  const [searchQuery, setSearchQuery] = React.useState('');

  if (!isOpen) return null;

  const filteredClients = clients.filter(client =>
    `${client.firstName} ${client.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-medium text-gray-900">Select Property Owner</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-4">
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search clients..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={onCreateNew}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Client
            </button>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {filteredClients.length > 0 ? (
              <div className="divide-y">
                {filteredClients.map((client) => (
                  <div
                    key={client.id}
                    onClick={() => onSelect(client.id)}
                    className="p-4 hover:bg-gray-50 cursor-pointer transition"
                  >
                    <div className="font-medium text-gray-900">
                      {client.firstName} {client.lastName}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      <div>{client.address}</div>
                      <div>{client.city}</div>
                      <div>{client.phone}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No clients found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}