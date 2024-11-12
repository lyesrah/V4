import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePropertyStore } from '../store/propertyStore';
import { 
  Building2, 
  MapPin, 
  Ruler, 
  Stairs, 
  Key, 
  Wifi,
  Edit,
  ArrowLeft
} from 'lucide-react';

export default function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { properties } = usePropertyStore();
  const property = properties.find(p => p.id === id);

  if (!property) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Propriété non trouvée</h2>
        <button
          onClick={() => navigate('/properties')}
          className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-700"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour à la liste
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => navigate('/properties')}
          className="inline-flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Retour
        </button>
        <button
          onClick={() => navigate(`/properties/${id}/edit`)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition"
        >
          <Edit className="w-4 h-4 mr-2" />
          Modifier
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <div className="flex items-center space-x-4 mb-6">
          <div className="p-3 bg-blue-50 rounded-xl">
            <Building2 className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{property.name}</h1>
            <p className="text-gray-600">{property.type}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-gray-400 mt-1" />
              <div>
                <h3 className="font-medium text-gray-900">Adresse</h3>
                <p className="text-gray-600">{property.address}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Ruler className="w-5 h-5 text-gray-400 mt-1" />
              <div>
                <h3 className="font-medium text-gray-900">Surface</h3>
                <p className="text-gray-600">{property.surface} m²</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Stairs className="w-5 h-5 text-gray-400 mt-1" />
              <div>
                <h3 className="font-medium text-gray-900">Étage</h3>
                <p className="text-gray-600">
                  {property.floor}
                  {property.elevator && ' (avec ascenseur)'}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-start space-x-3">
              <Key className="w-5 h-5 text-gray-400 mt-1" />
              <div>
                <h3 className="font-medium text-gray-900">Accès</h3>
                <p className="text-gray-600">
                  {property.furnished ? 'Meublé' : 'Non meublé'}
                </p>
              </div>
            </div>

            {property.wifiName && (
              <div className="flex items-start space-x-3">
                <Wifi className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <h3 className="font-medium text-gray-900">Wi-Fi</h3>
                  <p className="text-gray-600">
                    Nom: {property.wifiName}
                    <br />
                    Mot de passe: {property.wifiPassword}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}