import React from 'react';
import { Outlet } from 'react-router-dom';
import { useLanguageStore } from '../../store/languageStore';
import Sidebar from './Sidebar';
import Layout from '../Layout';

export default function DashboardLayout() {
  const { t } = useLanguageStore(); // Add language store hook

  return (
    <Layout>
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
        <Sidebar />
        <div className="flex-1">
          <div className="p-6 lg:p-8 max-w-7xl mx-auto">
            <Outlet />
          </div>
        </div>
      </div>
    </Layout>
  );
}