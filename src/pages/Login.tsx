import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useLanguageStore } from '../store/languageStore';
import { Building2, Globe } from 'lucide-react';
import LanguageSelector from '../components/LanguageSelector';

export default function Login() {
  const navigate = useNavigate();
  const { signIn, error, loading } = useAuthStore();
  const { currentLanguage } = useLanguageStore();
  const [email, setEmail] = useState('demo@example.com');
  const [password, setPassword] = useState('demo123');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn(email, password);
    if (!error) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="w-full p-6">
        <nav className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Building2 className="w-6 h-6 text-blue-600" />
            <span className="text-xl font-semibold text-gray-900">AltaRent</span>
          </div>
          <div className="flex items-center space-x-4">
            <LanguageSelector />
            <Link
              to="/register"
              className="text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              {currentLanguage === 'fr' ? "S'inscrire" :
               currentLanguage === 'es' ? "Registrarse" :
               currentLanguage === 'it' ? "Registrati" :
               "Sign up"}
            </Link>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">
              {currentLanguage === 'fr' ? 'Connexion Agent' :
               currentLanguage === 'es' ? 'Inicio de Sesión de Agente' :
               currentLanguage === 'it' ? 'Accesso Agente' :
               'Agent Login'}
            </h1>
            <p className="mt-2 text-gray-600">
              {currentLanguage === 'fr' ? 'Entrez vos identifiants pour accéder à votre compte' :
               currentLanguage === 'es' ? 'Ingrese sus credenciales para acceder a su cuenta' :
               currentLanguage === 'it' ? 'Inserisci le tue credenziali per accedere al tuo account' :
               'Enter your credentials to access your account'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={currentLanguage === 'fr' ? 'Adresse email' :
                            currentLanguage === 'es' ? 'Correo electrónico' :
                            currentLanguage === 'it' ? 'Indirizzo email' :
                            'Email address'}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
              />
            </div>

            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={currentLanguage === 'fr' ? 'Mot de passe' :
                            currentLanguage === 'es' ? 'Contraseña' :
                            currentLanguage === 'it' ? 'Password' :
                            'Password'}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center bg-red-50 rounded-xl p-3">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                currentLanguage === 'fr' ? 'Connexion...' :
                currentLanguage === 'es' ? 'Conectando...' :
                currentLanguage === 'it' ? 'Accesso...' :
                'Signing in...'
              ) : (
                currentLanguage === 'fr' ? 'Se connecter' :
                currentLanguage === 'es' ? 'Iniciar sesión' :
                currentLanguage === 'it' ? 'Accedi' :
                'Sign in'
              )}
            </button>

            <div className="text-sm text-center text-gray-600">
              <Link
                to="/forgot-password"
                className="hover:text-blue-600 transition-colors"
              >
                {currentLanguage === 'fr' ? 'Mot de passe oublié ?' :
                 currentLanguage === 'es' ? '¿Olvidaste tu contraseña?' :
                 currentLanguage === 'it' ? 'Password dimenticata?' :
                 'Forgot password?'}
              </Link>
            </div>
          </form>

          <div className="mt-8 text-center text-sm text-gray-500">
            <p>
              {currentLanguage === 'fr' ? 'Identifiants de démonstration :' :
               currentLanguage === 'es' ? 'Credenciales de demostración:' :
               currentLanguage === 'it' ? 'Credenziali demo:' :
               'Demo credentials:'}
            </p>
            <p className="font-mono mt-1">demo@example.com / demo123</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full p-6">
        <div className="max-w-7xl mx-auto text-center text-sm text-gray-500">
          © 2024 AltaRent. {currentLanguage === 'fr' ? 'Tous droits réservés.' :
                           currentLanguage === 'es' ? 'Todos los derechos reservados.' :
                           currentLanguage === 'it' ? 'Tutti i diritti riservati.' :
                           'All rights reserved.'}
        </div>
      </footer>
    </div>
  );
}