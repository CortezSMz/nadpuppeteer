import { Page } from "puppeteer-core";
import { createSubWindow } from "../windows/SubWindow";
import { AlertOptions, popAlert, setProgress, sleep } from "./Util";

export interface Step {
  title: string;
  do: (
    page: Page,
    data?: { [key: string]: unknown }
  ) => unknown | Record<string, unknown>;
}

interface IteratorOptions {
  data?: { [key: string]: unknown };
  expect?: Array<string>;
  progress?: boolean;
  delay?: number;
  alert?: AlertOptions;
}

export default class StepIterator {
  private steps: Array<Step>;

  private index: number;

  private options: IteratorOptions;

  constructor(steps: Array<Step>, options: IteratorOptions) {
    this.steps = steps;

    this.index = -1;

    this.options = {
      ...options,
      progress: true,
      delay: 250,
    };
  }

  public async iterate(): Promise<Record<string, unknown>> {
    const subWindow = await createSubWindow();

    subWindow.window.show();

    let responses: Record<string, unknown>;

    while (this.hasNext) {
      const step = this.next();

      if (this.options.progress)
        setProgress({
          value: Math.floor((this.index / (this.steps.length - 1)) * 100),
        });

      popAlert({
        text: step.title,
        ...this.options.alert,
      });

      try {
        const response = await step.do(subWindow.page, this.options.data);

        if (response && this.options.expect && this.options.expect.length)
          for (const ex of this.options.expect) {
            const hasOwnProperty: boolean =
              Object.prototype.hasOwnProperty.call(response, ex);

            if (hasOwnProperty) {
              responses = {
                ...responses,
                ...(response as unknown as Record<string, unknown>),
              };

              this.options.data = {
                ...this.options.data,
                ...responses,
              };
            }
          }
      } catch (error) {
        this.prev();
        popAlert({ text: error, color: "error" });
        console.log(error);
      }

      await sleep(this.options.delay);
    }

    subWindow.window.hide();

    return responses;
  }

  private next(): Step {
    if (this.hasNext) ++this.index;
    return this.steps[this.index];
  }

  private prev(): Step {
    if (this.hasPrev) --this.index;
    return this.steps[this.index];
  }

  private get hasNext(): boolean {
    return this.index < this.steps.length - 1;
  }

  private get hasPrev(): boolean {
    return this.index > 0;
  }
}
