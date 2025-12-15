export type Language = 'ar' | 'en' | 'fr';

export const translations = {
  ar: {
    appTitle: 'ناطق',
    beta: 'تجريبي',
    heroTitle: 'حوّل نصوصك إلى كلام مسموع',
    heroSubtitle: 'باستخدام أحدث تقنيات الذكاء الاصطناعي من Google Gemini',
    inputLabel: 'النص المراد تحويله',
    inputPlaceholder: 'أكتب النص هنا... مثلاً: السلام عليكم، كيف حالك اليوم؟',
    charCount: 'حرف',
    selectVoice: 'اختر المعلق الصوتي',
    generate: 'توليد الصوت',
    generating: 'جاري المعالجة...',
    errorEmpty: 'الرجاء كتابة نص أولاً',
    errorLong: 'النص طويل جداً. يرجى تقليل النص لأقل من 5000 حرف.',
    errorGeneric: 'حدث خطأ أثناء توليد الصوت',
    historyTitle: 'السجل السابق',
    nowPlaying: 'جاري التشغيل الآن',
    currentAudio: 'المقطع الصوتي الحالي',
    footer: 'تم التطوير باستخدام Gemini API & React',
    male: 'رجل',
    female: 'امرأة',
    voiceDesc: {
      Puck: 'عميق وهادئ',
      Charon: 'عميق وموثوق',
      Kore: 'هادئ ومتزن',
      Fenrir: 'قوي وحماسي',
      Zephyr: 'ناعم وواضح'
    },
    download: 'تحميل',
    seconds: 'ثانية',
    languageName: 'العربية'
  },
  en: {
    appTitle: 'Natiq',
    beta: 'Beta',
    heroTitle: 'Turn Text into Lifelike Speech',
    heroSubtitle: 'Powered by the latest Google Gemini AI technology',
    inputLabel: 'Input Text',
    inputPlaceholder: 'Type here... e.g. Hello, how are you today?',
    charCount: 'chars',
    selectVoice: 'Select Voice',
    generate: 'Generate Speech',
    generating: 'Processing...',
    errorEmpty: 'Please enter some text first',
    errorLong: 'Text is too long. Please keep it under 5000 characters.',
    errorGeneric: 'An error occurred while generating speech',
    historyTitle: 'History',
    nowPlaying: 'Now Playing',
    currentAudio: 'Current Audio Track',
    footer: 'Built with Gemini API & React',
    male: 'Male',
    female: 'Female',
    voiceDesc: {
      Puck: 'Deep & Calm',
      Charon: 'Deep & Authoritative',
      Kore: 'Calm & Balanced',
      Fenrir: 'Strong & Energetic',
      Zephyr: 'Soft & Clear'
    },
    download: 'Download',
    seconds: 's',
    languageName: 'English'
  },
  fr: {
    appTitle: 'Natiq',
    beta: 'Bêta',
    heroTitle: 'Transformez vos textes en parole',
    heroSubtitle: 'Propulsé par la technologie Google Gemini AI',
    inputLabel: 'Texte à convertir',
    inputPlaceholder: 'Écrivez ici... ex : Bonjour, comment allez-vous ?',
    charCount: 'caractères',
    selectVoice: 'Choisir une voix',
    generate: 'Générer l\'audio',
    generating: 'Traitement...',
    errorEmpty: 'Veuillez d\'abord saisir du texte',
    errorLong: 'Le texte est trop long. Veuillez limiter à 5000 caractères.',
    errorGeneric: 'Une erreur est survenue lors de la génération',
    historyTitle: 'Historique',
    nowPlaying: 'Lecture en cours',
    currentAudio: 'Piste audio actuelle',
    footer: 'Construit avec Gemini API & React',
    male: 'Homme',
    female: 'Femme',
    voiceDesc: {
      Puck: 'Profond & Calme',
      Charon: 'Profond & Autoritaire',
      Kore: 'Calme & Équilibré',
      Fenrir: 'Fort & Énergique',
      Zephyr: 'Doux & Clair'
    },
    download: 'Télécharger',
    seconds: 's',
    languageName: 'Français'
  }
};

export const detectLanguage = (): Language => {
  if (typeof navigator === 'undefined') return 'ar';
  const browserLang = navigator.language.split('-')[0];
  if (browserLang === 'en' || browserLang === 'fr') {
    return browserLang;
  }
  return 'ar';
};