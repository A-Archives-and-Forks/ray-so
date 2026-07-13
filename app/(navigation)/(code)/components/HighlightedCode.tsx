import classNames from "classnames";
import React, { useEffect, useState } from "react";
import { Language, LANGUAGES } from "../util/languages";

import styles from "./Editor.module.css";
import { highlightedLinesAtom, highlighterAtom, loadingLanguageAtom } from "../store";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { THEMES, themeDarkModeAtom, themeAtom } from "../store/themes";

type PropTypes = {
  selectedLanguage: Language | null;
  code: string;
};

const HighlightedCode: React.FC<PropTypes> = ({ selectedLanguage, code }) => {
  const [highlightedHtml, setHighlightedHtml] = useState("");
  const highlighter = useAtomValue(highlighterAtom);
  const setIsLoadingLanguage = useSetAtom(loadingLanguageAtom);
  const highlightedLines = useAtomValue(highlightedLinesAtom);
  const darkMode = useAtomValue(themeDarkModeAtom);
  const theme = useAtomValue(themeAtom);
  const themeName = theme.id === "tailwind" ? (darkMode ? "tailwind-dark" : "tailwind-light") : "css-variables";

  useEffect(() => {
    const generateHighlightedHtml = async () => {
      if (!highlighter || !selectedLanguage || selectedLanguage === LANGUAGES.plaintext) {
        return code.replace(/[\u00A0-\u9999<>\&]/g, (i) => `&#${i.charCodeAt(0)};`);
      }

      const loadedLanguages = highlighter.getLoadedLanguages() || [];
      const hasLoadedLanguage = loadedLanguages.includes(selectedLanguage.name.toLowerCase());

      if (!hasLoadedLanguage && selectedLanguage.src) {
        setIsLoadingLanguage(true);
        await highlighter.loadLanguage(selectedLanguage.src);
        setIsLoadingLanguage(false);
      }

      let lang = selectedLanguage.name.toLowerCase();
      if (lang === "typescript") {
        lang = "tsx";
      }

      const decorations =
        theme.id === THEMES.browserbase.id
          ? Array.from(code.matchAll(/\bprocess\.env\.([A-Za-z_$][\w$]*)/g), (match) => {
              const start = match.index + "process.env.".length;

              return {
                start,
                end: start + match[1].length,
                alwaysWrap: true,
                properties: { class: "browserbase-environment-variable" },
              };
            })
          : [];

      return highlighter.codeToHtml(code, {
        lang: lang,
        theme: themeName,
        decorations,
        transformers: [
          {
            line(node, line) {
              node.properties["data-line"] = line;
              if (highlightedLines.includes(line)) this.addClassToHast(node, "highlighted-line");
            },
          },
        ],
      });
    };

    generateHighlightedHtml().then((newHtml) => {
      setHighlightedHtml(newHtml);
    });
  }, [
    code,
    selectedLanguage,
    highlighter,
    setIsLoadingLanguage,
    setHighlightedHtml,
    highlightedLines,
    theme.id,
    themeName,
  ]);

  return (
    <div
      className={classNames(styles.formatted, selectedLanguage === LANGUAGES.plaintext && styles.plainText)}
      dangerouslySetInnerHTML={{
        __html: highlightedHtml,
      }}
    />
  );
};

export default HighlightedCode;
