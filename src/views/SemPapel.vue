<template>
  <v-container>
    <v-container style="padding: 0px">
      <!-- ROUTER -->
      <router-view> </router-view>

      <!-- UI -->
      <UI />
    </v-container>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import UI from "../components/SemPapel/UI.vue";
import { themes } from "../plugins/vuetify";

export default Vue.extend({
  name: "SemPapel",

  components: {
    UI,
  },

  beforeMount() {
    this.$vuetify.theme.themes.light = themes.sempapel.light;
    this.$vuetify.theme.themes.dark = themes.sempapel.dark;
  },
});
</script>
