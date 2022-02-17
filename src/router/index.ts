import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Login from "../views/Login.vue";

// SPSemPapel
import SemPapel from "../views/SemPapel.vue";
import Inserviveis from "../components/SemPapel/Inserviveis.vue";
import IncluirProcesso from "../components/SemPapel/IncluirProcesso.vue";

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
        path: "/sempapel/inserviveis",
        name: "Inserviveis",
        component: Inserviveis,
      },
      {
        path: "/sempapel/incluir",
        name: "Incluir Processo",
        component: IncluirProcesso,
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
