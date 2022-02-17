import { ipcMain } from "electron";
import { Page } from "puppeteer-core";
import { popAlert, setProgress, sleep, stepIterator } from "./../util/Util";
import { getWindow } from "../lib/WindowManager";
import { createSubWindow } from "../windows/SubWindow";

ipcMain.on(
  "entrar",
  async (_, creds: { username: string; password: string }) => {
    const ite = stepIterator(entrar);

    const subWindow = await createSubWindow();

    subWindow.window.show();

    while (ite.hasNext()) {
      const step = ite.next();

      setProgress({
        value: Math.floor((step.index / (entrar.length - 1)) * 100),
      });

      try {
        const res = await step.value.do(subWindow.page, creds);

        if (
          step.value.title === "Verificando..." &&
          res &&
          typeof res === "string"
        )
          throw res;
        else if (
          step.value.title === "Verificando..." &&
          res &&
          typeof res === "boolean"
        ) {
          subWindow.window.hide();

          getWindow("MainWindow").window.webContents.send(
            "semPapelEntrarSucesso",
            creds
          );
        }
      } catch (error) {
        subWindow.window.hide();
        console.log(error);

        popAlert({ text: error, color: "error" });

        break;
      }

      await sleep(250);
    }
  }
);

const entrar = [
  {
    title: "Indo para a página de login...",
    do: (page: Page) =>
      page.goto(
        "https://www.documentos.spsempapel.sp.gov.br/siga/public/app/login",
        { waitUntil: "networkidle0" }
      ),
  },
  {
    title: "Preenchendo login...",
    do: (page: Page, { username }: { username: string }) =>
      page.type("#username", username),
  },
  {
    title: "Preenchendo senha...",
    do: (page: Page, { password }: { password: string }) =>
      page.type("#password", password),
  },
  {
    title: "Clicando no botão entrar...",
    do: (page: Page) =>
      Promise.all([
        page.click("#formLogin > div.row.pt-3 > div > div > button"),
        page.waitForNavigation({ waitUntil: "networkidle0" }),
      ]),
  },
  {
    title: "Verificando...",
    do: async (page: Page) => {
      let error;

      try {
        error = await page.$(
          "body > div.container.content.pt-2 > div > div > div > div.login-invalido"
        );
      } catch (err) {
        //
      }

      // TODO: refactor(entrar): better login success handler
      if (!error) return true;

      const message = await page.evaluate((el) => el.innerText, error);

      return message.replace(
        "ou clique Esqueci minha senha",
        "ou altere sua senha no site."
      );
    },
  },
];
