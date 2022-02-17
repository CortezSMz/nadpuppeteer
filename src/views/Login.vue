<template>
  <v-app-bar app>
    <v-tabs
      v-model="tab"
      :background-color="theme.background"
      :slider-color="theme.slide"
      :color="theme.font"
      icons-and-text
      centered
      grow
    >
      <v-tab>SPSemPapel</v-tab>
      <v-tab-item>
        <SemPapelLogin />
      </v-tab-item>
      <v-tab>GEMAT</v-tab>
      <v-tab-item>
        <GematLogin />
      </v-tab-item>
    </v-tabs>
  </v-app-bar>
</template>

<script lang="ts">
import Vue from "vue";
import GematLogin from "../components/GEMAT/Login.vue";
import SemPapelLogin from "../components/SemPapel/Login.vue";

export default Vue.extend({
  name: "Login",

  data() {
    return {
      tab: 0,
    };
  },

  computed: {
    theme() {
      switch (this.tab) {
        case 1:
          return {
            slide: "white",
            font: "white",
            background: "#900",
          };
        case 0:
        default:
          return {
            slide: "#34b44c",
            font: "#34b44c",
            background: "#d1e6df",
          };
      }
    },
  },

  components: {
    SemPapelLogin,
    GematLogin,
  },
});
</script>
