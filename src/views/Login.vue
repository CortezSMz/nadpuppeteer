<template>
  <v-app-bar app>
    <v-tabs v-model="tab" :color="primary" centered grow :dark="tab === 1">
      <v-tab class="secondary">SPSemPapel</v-tab>
      <v-tab-item>
        <SemPapelLogin />
      </v-tab-item>
      <v-tab class="secondary">GEMAT</v-tab>
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
import { themes } from "../plugins/vuetify";

export default Vue.extend({
  name: "Login",

  data() {
    return {
      tab: 0,
    };
  },

  watch: {
    tab(t) {
      switch (t) {
        case 1:
          this.$vuetify.theme.themes.light = themes.gemat.light;
          this.$vuetify.theme.themes.dark = themes.gemat.dark;
          break;
        case 0:
        default:
          this.$vuetify.theme.themes.light = themes.sempapel.light;
          this.$vuetify.theme.themes.dark = themes.sempapel.dark;
      }
    },
  },

  components: {
    SemPapelLogin,
    GematLogin,
  },

  beforeMount() {
    this.$vuetify.theme.themes.light = themes.sempapel.light;
    this.$vuetify.theme.themes.dark = themes.sempapel.dark;
  },
});
</script>
