import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

const translations = {
  ar: {
    appName: 'محضّر الكميات المجمعة',
    footer: 'صُنع لتسهيل عمليات المستودعات',
    language: 'English',
    toolTitle: 'أداة حساب كميات السحب',
    toolDescription: 'الصق الكميات المتاحة من نظامك، أدخل الكمية المطلوبة، واحصل على قائمة السحب المثالية فورًا.',
    pasteLabel: '1. الصق الكميات المتاحة هنا',
    pastePlaceholder: 'مثال:\n1\n50\n1000\n2000',
    targetLabel: '2. أدخل الكمية الإجمالية المطلوبة',
    targetPlaceholder: 'مثال: 2500',
    calculateButton: 'حساب القائمة',
    clearButtonTitle: 'مسح الكل',
    resultsTitle: 'قائمة السحب المحسوبة',
    resultsPlaceholder: 'ستظهر النتائج هنا بعد الحساب.',
    totalPicked: 'الإجمالي المحسوب:',
    copyButtonTitle: 'نسخ النتائج',
    copiedButton: 'تم النسخ!',
    error_no_quantities: 'الرجاء لصق الكميات المتاحة بشكل صحيح.',
    error_invalid_target: 'الرجاء إدخال الكمية المطلوبة كرقم صحيح موجب.',
    error_insufficient: (total: number, target: number) => `الكمية المتاحة (${total.toLocaleString('ar-EG')}) أقل من الكمية المطلوبة (${target.toLocaleString('ar-EG')}).`,
  },
  en: {
    appName: 'Bulk Quantity Picker',
    footer: 'Made to simplify warehouse operations',
    language: 'العربية',
    toolTitle: 'Picking Quantity Calculator',
    toolDescription: 'Paste available quantities from your system, enter the target quantity, and get the optimal pick list instantly.',
    pasteLabel: '1. Paste available quantities here',
    pastePlaceholder: 'Example:\n1\n50\n1000\n2000',
    targetLabel: '2. Enter the total required quantity',
    targetPlaceholder: 'Example: 2500',
    calculateButton: 'Calculate List',
    clearButtonTitle: 'Clear All',
    resultsTitle: 'Calculated Pick List',
    resultsPlaceholder: 'Results will appear here after calculation.',
    totalPicked: 'Total Picked:',
    copyButtonTitle: 'Copy results',
    copiedButton: 'Copied!',
    error_no_quantities: 'Please paste the available quantities correctly.',
    error_invalid_target: 'Please enter the required quantity as a positive integer.',
    error_insufficient: (total: number, target: number) => `Available quantity (${total.toLocaleString('en-US')}) is less than the required quantity (${target.toLocaleString('en-US')}).`,
  },
};

type Language = 'ar' | 'en';
type TranslationKey = keyof typeof translations.ar;

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: TranslationKey, ...args: any[]) => string;
  dir: 'rtl' | 'ltr';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('ar');
  const dir = language === 'ar' ? 'rtl' : 'ltr';

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'ar' ? 'en' : 'ar'));
  };

  const t = (key: TranslationKey, ...args: any[]): string => {
    const translationSet = translations[language];
    // @ts-ignore - We assume keys are symmetrical
    const translation = translationSet[key] || translations['en'][key];
    if (typeof translation === 'function') {
      // @ts-ignore
      return translation(...args);
    }
    return translation as string;
  };
  
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = dir;
  }, [language, dir]);

  const value = { language, toggleLanguage, t, dir };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
