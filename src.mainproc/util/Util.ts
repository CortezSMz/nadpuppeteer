import { getWindow } from "../lib/WindowManager";

interface Step {
  title: string;
  // eslint-disable-next-line @typescript-eslint/ban-types
  do: Function;
}

export interface AlertOptions {
  text: string;
  title?: string;
  color?: string;
  icon?: string;
  timeout?: number;
  position?: string;
}

export interface ProgressOptions {
  value: number;
  buffer?: number;
  query?: boolean;
}

export function stepIterator(array: Step[]): {
  next: () => {
    value: Step;
    index: number;
  };
  prev: () => {
    value: Step;
    index: number;
  };
  hasNext: () => boolean;
  hasPrev: () => boolean;
} {
  let i = -1;
  return {
    next: function () {
      if (this.hasNext()) ++i;
      return {
        value: array[i],
        index: i,
      };
    },
    prev: function () {
      if (this.hasPrev()) --i;
      return {
        value: array[i],
        index: i,
      };
    },
    hasNext: function () {
      return i < array.length - 1;
    },
    hasPrev: function () {
      return i > 0;
    },
  };
}

export function popAlert(alertOptions: AlertOptions): void {
  getWindow("MainWindow").window.webContents.send("alert", alertOptions);
}

export function setProgress(progressOptions: ProgressOptions): void {
  getWindow("MainWindow").window.webContents.send("progress", progressOptions);
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
