import en from './en.json';
import ar from './ar.json';

let currentLang = en;

const langs = {
  en,
  ar,
};

export const setLang = (lang: string) => {
  currentLang = langs[lang];
};

export const i18n = () => currentLang;

export default i18n;
