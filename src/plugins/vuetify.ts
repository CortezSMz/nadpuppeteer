import Vue from "vue";
import Vuetify from "vuetify/lib/framework";

// TODO(themes): make something unique for each theme
export const themes = {
  default: {
    light: {
      primary: "#36393f",
      secondary: "#6c757d",
      accent: "#17a2b8",
      error: "#dc3545",
      info: "#17a2b8",
      success: "#28a745",
      warning: "#FE5000",
    },
    dark: {
      //
    },
  },
  sempapel: {
    light: {
      primary: "#34b44c",
      secondary: "#d1e6df",
      accent: "#007bff",
      error: "#dc3545",
      info: "#17a2b8",
      success: "#28a745",
      warning: "#FE5000",
    },
    dark: {
      primary: "#34b44c",
      secondary: "#d1e6df",
      accent: "",
      error: "#dc3545",
      info: "#17a2b8",
      success: "#28a745",
      warning: "#FE5000",
    },
  },
  gemat: {
    light: {
      primary: "#ffffff",
      secondary: "#990000",
      accent: "",
      error: "#dc3545",
      info: "#17a2b8",
      success: "#28a745",
      warning: "#FE5000",
    },
    dark: {
      primary: "#ffff00",
      secondary: "#990000",
      accent: "",
      error: "#dc3545",
      info: "#17a2b8",
      success: "#28a745",
      warning: "#FE5000",
    },
  },
};

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    options: {
      customProperties: true,
    },
    themes: themes.default,
  },
  icons: {
    iconfont: "fa",
  },
});
