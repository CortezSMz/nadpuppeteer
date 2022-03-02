import Vue, { DirectiveOptions } from "vue";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import inputUpperCase from "./plugins/inputUpperCase";
import "roboto-fontface/css/roboto/roboto-fontface.css";
import "@fortawesome/fontawesome-free/css/all.css";
import "@fortawesome/fontawesome-free";
import "@fortawesome/fontawesome-svg-core";
import "@fortawesome/free-regular-svg-icons";
import "@fortawesome/free-solid-svg-icons";

export interface Escolas {
  [key: string]: {
    processos: {
      [key: string]: {
        pendencias: Array<string>;
        documentos: Array<string>;
        situacao: Array<string>;
      };
    };
  };
}

export interface Credentials {
  sempapel: {
    username: string | null;
    password: string | null;
  };
  gemat: {
    username: string | null;
    password: string | null;
  };
}

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

Vue.config.productionTip = false;

Vue.directive("upper-case", inputUpperCase as unknown as DirectiveOptions);

new Vue({
  data: {
    escolas: {} as Escolas,
    credentials: {
      sempapel: {
        username: null,
        password: null,
      },
      gemat: {
        username: null,
        password: null,
      },
    } as Credentials,

    alert: {
      title: "",
      text: "Algo deu errado.",
      color: "success",
      icon: "fa-check",
      position: "top",
      timeout: 10000,
    } as AlertOptions,

    progress: {
      visible: true,
      value: 0,
      buffer: 0,
      stream: false,
      indeterminate: false,
      query: false,
    } as ProgressOptions,
  },
  router,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
