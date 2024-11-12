import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePropertyStore } from '../store/propertyStore';
import { Building2, Plus, Edit, Trash2, Home, Building, Hotel } from 'lucide-react';
import { Property } from '../types';

const getPropertyIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'maison':
      return <Home className="w-5 h-5" />;
    case 'appartement':
      return <Building className="w-5 h-5" />;
    case 'studio':
      return <Hotel className="w-5 h-5" />;
    default:
      return <Building2 className="w-5 h-5" />;
  }
};

export default function PropertyList() {
  const navigate = useNavigate();
  const { properties, deleteProperty } = usePropertyStore();
  const [search, setSearch] = useState('');

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette propriété ?')) {
      await deleteProperty(id);
    }
  };

  const filteredProperties = properties.filter((property) =>
    property.name.toLowerCase().includes(search.toLowerCase()) ||
    property.address.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Building2 className="w-8 h-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Propriétés</h1>
        </div>
        <button
          onClick={() => navigate('/properties/new')}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle propriété
        </button>
      </div>

      <div className="relative">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher une propriété..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.map((property) => (
          <div
            key={property.id}
            onClick={() => navigate(`/properties/${property.id}`)}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition cursor-pointer"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-50 rounded-lg">
                {getPropertyIcon(property.type)}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/properties/${property.id}/edit`);
                  }}
                  className="p-2 text-gray-400 hover:text-blue-600 transition"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={(e) => handleDelete(property.id, e)}
                  className="p-2 text-gray-400 hover:text-red-600 transition"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {property.name}
            </h3>
            <div className="space-y-2 text-gray-600">
              <p>{property.address}</p>
              <div className="flex items-center justify-between text-sm">
                <span>{property.type}</span>
                <span>{property.surface} m²</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Étage {property.floor}</span>
                <span>{property.furnished ? 'Meublé' : 'Non meublé'}</span>
              </div>
            </div>
          </div>
        ))}

        {filteredProperties.length === 0 && (
          <div className="col-span-full text-center py-12">
            <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucune propriété trouvée
            </h3>
            <p className="text-gray-500">
              {search
                ? 'Essayez d\'ajuster votre recherche'
                : 'Commencez par ajouter votre première propriété'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}