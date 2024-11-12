import React from 'react';
import { ClipboardList, Plus, Calendar, Users, CheckSquare } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'En cours' | 'Terminé' | 'En attente';
  dueDate: string;
  team: string[];
  progress: number;
}

const projects: Project[] = [
  {
    id: '1',
    name: 'Rénovation Appartement Paris',
    description: 'Rénovation complète de l\'appartement du 15ème arrondissement',
    status: 'En cours',
    dueDate: '2024-04-15',
    team: ['Marie L.', 'Thomas D.', 'Sophie M.'],
    progress: 65
  },
  {
    id: '2',
    name: 'Installation Domotique',
    description: 'Installation des systèmes de domotique dans les appartements',
    status: 'En attente',
    dueDate: '2024-05-01',
    team: ['Pierre B.', 'Julie R.'],
    progress: 0
  },
  {
    id: '3',
    name: 'Mise aux normes électriques',
    description: 'Mise en conformité des installations électriques',
    status: 'Terminé',
    dueDate: '2024-03-10',
    team: ['Marc D.', 'Lucie F.'],
    progress: 100
  }
];

const getStatusColor = (status: Project['status']) => {
  switch (status) {
    case 'En cours':
      return 'bg-blue-100 text-blue-700';
    case 'Terminé':
      return 'bg-green-100 text-green-700';
    case 'En attente':
      return 'bg-yellow-100 text-yellow-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

export default function ProjectList() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <ClipboardList className="w-8 h-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Gestion de Projet</h1>
        </div>
        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition">
          <Plus className="w-4 h-4 mr-2" />
          Nouveau projet
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-1">
                  {project.name}
                </h2>
                <p className="text-gray-600">{project.description}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
                {project.status}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="flex items-center space-x-2 text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>Échéance: {new Date(project.dueDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Users className="w-4 h-4" />
                <span>Équipe: {project.team.join(', ')}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <CheckSquare className="w-4 h-4" />
                <span>Progression: {project.progress}%</span>
              </div>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 rounded-full h-2 transition-all"
                style={{ width: `${project.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}