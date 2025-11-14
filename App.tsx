import React from 'react';
import BulkPicker from './components/BulkPicker.tsx';
import { CalculatorIcon, LanguageIcon } from './components/icons.tsx';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext.tsx';

const MainLayout: React.FC = () => {
  const { t, toggleLanguage } = useLanguage();

  return (
    <div className="bg-slate-900 text-slate-200 min-h-screen font-sans">
      <header className="p-4 bg-slate-900/80 backdrop-blur-lg border-b border-slate-700/50 sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <CalculatorIcon className="h-8 w-8 text-cyan-400" />
            <h1 className="text-xl font-bold text-white">{t('appName')}</h1>
          </div>
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-3 py-2 bg-slate-700 text-slate-200 rounded-lg hover:bg-slate-600 transition-colors text-sm"
            title="Change language"
          >
            <LanguageIcon />
            <span>{t('language')}</span>
          </button>
        </div>
      </header>
      <main className="container mx-auto py-6">
        <BulkPicker />
      </main>
      <footer className="text-center p-4 text-slate-500 text-sm">
        {t('footer')}
      </footer>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <MainLayout />
    </LanguageProvider>
  );
};

export default App;