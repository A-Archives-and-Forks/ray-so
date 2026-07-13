import classNames from "classnames";
import { useAtom, useAtomValue } from "jotai";

import { fileNameAtom, showBackgroundAtom } from "../../store";
import { paddingAtom } from "../../store/padding";
import { themeDarkModeAtom } from "../../store/themes";

import Editor from "../Editor";
import sharedStyles from "./DefaultFrame.module.css";
import styles from "./BrowserbaseFrame.module.css";

const BACKGROUND_CELL_COUNT = 48;

const BrowserbaseFrame = () => {
  const darkMode = useAtomValue(themeDarkModeAtom);
  const [padding] = useAtom(paddingAtom);
  const [showBackground] = useAtom(showBackgroundAtom);
  const [fileName, setFileName] = useAtom(fileNameAtom);

  return (
    <div
      className={classNames(
        sharedStyles.frame,
        showBackground && styles.frame,
        !darkMode && styles.frameLightMode,
        !showBackground && sharedStyles.noBackground,
        !showBackground && styles.noBackground,
      )}
      style={{ padding }}
    >
      {!showBackground && <div data-ignore-in-export className={sharedStyles.transparentPattern}></div>}
      {showBackground && (
        <div className={styles.background} aria-hidden="true">
          {Array.from({ length: BACKGROUND_CELL_COUNT }, (_, index) => (
            <div className={styles.backgroundCell} key={index}>
              <div className={styles.backgroundShape}></div>
            </div>
          ))}
        </div>
      )}
      <div className={styles.window}>
        <div className={classNames(sharedStyles.header, styles.header)}>
          <div className={sharedStyles.controls}>
            <div className={classNames(sharedStyles.control, styles.control)}></div>
            <div className={classNames(sharedStyles.control, styles.control)}></div>
            <div className={classNames(sharedStyles.control, styles.control)}></div>
          </div>
          <div className={classNames(sharedStyles.fileName, styles.fileName)}>
            <input
              type="text"
              value={fileName}
              onChange={(event) => setFileName(event.target.value)}
              spellCheck={false}
              tabIndex={-1}
            />
            {fileName.length === 0 ? <span data-ignore-in-export>Untitled-1</span> : null}
          </div>
          <div />
        </div>
        <Editor />
      </div>
    </div>
  );
};

export default BrowserbaseFrame;
