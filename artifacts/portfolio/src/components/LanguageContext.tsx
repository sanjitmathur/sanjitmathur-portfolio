import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import translations, { LANG_META, type Lang, type T } from "../i18n";

interface LanguageCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: T;
  dir: "ltr" | "rtl";
}

const Ctx = createContext<LanguageCtx>({
  lang: "en",
  setLang: () => {},
  t: translations.en,
  dir: "ltr",
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    const saved = localStorage.getItem("sm-lang");
    return (saved && saved in translations ? saved : "en") as Lang;
  });

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("sm-lang", l);
  };

  // Apply dir attribute for RTL languages
  useEffect(() => {
    const dir = LANG_META[lang].dir;
    document.documentElement.setAttribute("dir", dir);
  }, [lang]);

  return (
    <Ctx.Provider value={{ lang, setLang, t: translations[lang], dir: LANG_META[lang].dir }}>
      {children}
    </Ctx.Provider>
  );
}

export function useLang() {
  return useContext(Ctx);
}
