import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Login from "../views/Login.vue";

// SPSemPapel
import SemPapel from "../views/SemPapel.vue";
import Processos from "../components/SemPapel/Processos/Processos.vue";
import Incluir from "../components/SemPapel/Processos/Incluir.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Login",
    component: Login,
  },
  {
    path: "/sempapel",
    name: "SemPapel",
    component: SemPapel,
    children: [
      {
        path: "/sempapel/processos",
        name: "Processos",
        component: Processos,
      },
      {
        path: "/sempapel/incluir",
        name: "Incluir Processo",
        component: Incluir,
      },
    ],
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
