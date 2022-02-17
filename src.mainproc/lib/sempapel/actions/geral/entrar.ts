import type { Page } from "puppeteer-core";
import { Action, ActionsGerais } from "../../Actions";

export default [
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
      if (!error) return { success: true };

      const message = await page.evaluate((el) => el.innerText, error);

      return {
        error: message.replace(
          "ou clique Esqueci minha senha",
          "ou altere sua senha no site."
        ),
      };
    },
  },
] as Action[ActionsGerais.ENTRAR];
