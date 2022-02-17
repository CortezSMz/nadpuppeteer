import Vue from "vue";
import Vuetify from "vuetify/lib/framework";

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    options: {
      customProperties: true,
    },
    themes: {
      light: {
        primary: "#36393f",
        secondary: "#6c757d",
        accent: "#17a2b8",
        error: "#dc3545",
        info: "#17a2b8",
        success: "#28a745",
        warning: "#FE5000",
      },
    },
  },
  icons: {
    iconfont: "fa",
  },
});
