import { getWindow } from "./WindowManager";

export interface AlertOptions {
  text?: string;
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

export function popAlert(alertOptions: AlertOptions): void {
  getWindow("MainWindow").window.webContents.send("alert", alertOptions);
}

export function setProgress(progressOptions: ProgressOptions): void {
  getWindow("MainWindow").window.webContents.send("progress", progressOptions);
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
