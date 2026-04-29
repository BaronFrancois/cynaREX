import React, { ReactNode } from 'react';
import Head from 'next/head';

interface AppLayoutProps {
  children: ReactNode;
  title?: string;
}

const AppLayoutRegLog: React.FC<AppLayoutProps> = ({
  children,
  title = "CYNA - Connexion / Inscription"
}) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Page de connexion ou d'inscription à CYNA" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
     
      <div className="min-h-screen bg-[#09090f] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>

      <style jsx global>{`
        /* Styles globaux pour les formulaires */
        .form-container {
          @apply bg-white rounded-xl shadow-lg p-8;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
       
        .form-title {
          @apply text-2xl font-bold text-gray-900 mb-8 text-center;
        }
       
        .form-group {
          @apply mb-5;
        }
       
        .form-label {
          @apply block text-sm font-medium text-gray-700 mb-1;
        }
       
        .form-input {
          @apply w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyna-600 focus:border-transparent transition duration-200;
        }
       
        .form-input-error {
          @apply border-red-500 focus:ring-red-500;
        }
       
        .error-message {
          @apply mt-1 text-sm text-red-600;
        }
       
        .submit-button {
          @apply w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-cyna-600 hover:bg-cyna-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyna-600 transition duration-200;
        }
       
        .submit-button:disabled {
          @apply bg-cyna-400 cursor-not-allowed;
        }
       
        .form-footer {
          @apply mt-6 text-center text-sm;
        }
       
        .form-link {
          @apply font-medium text-cyna-600 hover:text-cyna-500;
        }
       
        /* Animation de chargement */
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
       
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </>
  );
};

export default AppLayoutRegLog;
