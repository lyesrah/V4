import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClientStore } from '../store/clientStore';
import { Users, Plus, Edit, Trash2 } from 'lucide-react';
import ClientListFilters from '../components/clients/ClientListFilters';
import ClientProfile from '../components/clients/ClientProfile';
import { Client } from '../store/clientStore';

export default function ClientList() {
  const navigate = useNavigate();
  const { clients, deleteClient } = useClientStore();
  const [search, setSearch] = useState('');
  const [cityFilter, setCityFilter] = useState<string[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this client?')) {
      deleteClient(id);
    }
  };

  const filteredClients = useMemo(() => {
    return clients.filter((client) => {
      const matchesSearch = search.toLowerCase().trim() === '' ||
        `${client.firstName} ${client.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
        client.email.toLowerCase().includes(search.toLowerCase()) ||
        client.phone.toLowerCase().includes(search.toLowerCase());

      const matchesCity = cityFilter.length === 0 ||
        cityFilter.includes(client.city.toLowerCase());

      return matchesSearch && matchesCity;
    });
  }, [clients, search, cityFilter]);

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Users className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
          </div>
          <button
            onClick={() => navigate('/clients/new')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Client
          </button>
        </div>

        <ClientListFilters
          search={search}
          onSearchChange={setSearch}
          cityFilter={cityFilter}
          onCityFilterChange={setCityFilter}
        />

        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          {filteredClients.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {filteredClients.map((client) => (
                <li
                  key={client.id}
                  className="hover:bg-gray-50 transition cursor-pointer"
                  onClick={() => setSelectedClient(client)}
                >
                  <div className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {client.firstName} {client.lastName}
                        </h3>
                        <div className="mt-1 text-sm text-gray-500">
                          <div>{client.address}</div>
                          <div>{client.city}</div>
                          <div>{client.phone}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/clients/${client.id}/edit`);
                          }}
                          className="p-2 text-gray-400 hover:text-blue-600 transition"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={(e) => handleDelete(client.id, e)}
                          className="p-2 text-gray-400 hover:text-red-600 transition"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No clients found
              </h3>
              <p className="text-gray-500">
                {search || cityFilter.length > 0
                  ? 'Try adjusting your filters'
                  : 'Start by adding your first client'}
              </p>
            </div>
          )}
        </div>
      </div>

      {selectedClient && (
        <ClientProfile
          isOpen={true}
          onClose={() => setSelectedClient(null)}
          client={selectedClient}
        />
      )}
    </>
  );
}