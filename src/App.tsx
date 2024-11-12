import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import LeadDashboard from './pages/leads/LeadDashboard';
import ClientList from './pages/ClientList';
import ClientForm from './pages/ClientForm';
import Tasks from './pages/Tasks';
import Documentation from './pages/Documentation';
import Settings from './pages/Settings';
import Notifications from './pages/Notifications';
import ProjectList from './pages/ProjectList';
import Login from './pages/Login';
import Register from './pages/Register';
import { Toaster } from '@/components/ui/toaster';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/leads" element={<LeadDashboard />} />
          <Route path="/clients" element={<ClientList />} />
          <Route path="/clients/new" element={<ClientForm />} />
          <Route path="/clients/:id/edit" element={<ClientForm />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/docs" element={<Documentation />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/projects" element={<ProjectList />} />
        </Route>
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;