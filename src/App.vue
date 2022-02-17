<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>

    <Alert />
    <Progress />
  </v-app>
</template>

<style>
html {
  overflow-y: auto;
}
</style>

<script lang="ts">
import Vue from "vue";

import Alert from "./components/app/Alert.vue";
import Progress from "./components/app/Progress.vue";
import type { Escolas } from "./main";

import { ipcRenderer } from "electron";
declare const api: {
  updateEscolas: (callback: (escolas: Escolas) => void) => void;
  getEscolas: () => void;
};

export default Vue.extend({
  name: "App",

  components: {
    Alert,
    Progress,
  },

  methods: {
    updateEscolas(escolas: Escolas): void {
      this.$root.$data.escolas = escolas;
    },
  },

  beforeMount() {
    api.updateEscolas((escolas: Escolas) => {
      this.updateEscolas(escolas);
    });

    api.getEscolas();
  },
});
</script>
