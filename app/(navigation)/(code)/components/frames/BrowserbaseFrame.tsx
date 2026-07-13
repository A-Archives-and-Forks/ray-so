import classNames from "classnames";
import { useAtom, useAtomValue } from "jotai";

import { fileNameAtom, showBackgroundAtom } from "../../store";
import { paddingAtom } from "../../store/padding";
import { themeDarkModeAtom } from "../../store/themes";

import Editor from "../Editor";
import sharedStyles from "./DefaultFrame.module.css";
import styles from "./BrowserbaseFrame.module.css";

const VERTICAL_GRID_SEGMENTS = [0, 1 / 6, 2 / 6, 3 / 6, 4 / 6, 5 / 6, 1];
const HORIZONTAL_GRID_SEGMENTS = [0, 0.5, 1];

const getInsetGridPosition = (segment: number, padding: number) => {
  const percentage = Number((segment * 100).toFixed(4));
  const offset = Number((padding * (1 - 2 * segment)).toFixed(4));

  if (offset === 0) return `${percentage}%`;

  return `calc(${percentage}% ${offset > 0 ? "+" : "-"} ${Math.abs(offset)}px)`;
};

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
          {VERTICAL_GRID_SEGMENTS.map((segment) => (
            <div
              className={classNames(styles.backgroundGridline, styles.backgroundGridlineVertical)}
              key={segment}
              style={{ left: getInsetGridPosition(segment, padding) }}
            ></div>
          ))}
          {HORIZONTAL_GRID_SEGMENTS.map((segment) => (
            <div
              className={classNames(styles.backgroundGridline, styles.backgroundGridlineHorizontal)}
              key={segment}
              style={{ top: getInsetGridPosition(segment, padding) }}
            ></div>
          ))}
        </div>
      )}
      <div className={styles.window}>
        <div className={classNames(sharedStyles.header, styles.header)}>
          <div className={sharedStyles.controls}>
            <div className={sharedStyles.control}></div>
            <div className={sharedStyles.control}></div>
            <div className={sharedStyles.control}></div>
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
