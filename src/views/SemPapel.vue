<template>
  <v-container>
    <UI />
    <router-view> </router-view>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import UI from "../components/SemPapel/UI.vue";
import { themes } from "../plugins/vuetify";

export default Vue.extend({
  name: "SemPapel",

  data() {
    return {
      //
    };
  },

  components: {
    UI,
  },

  methods: {
    //
  },

  beforeMount() {
    this.$vuetify.theme.themes.light = themes.sempapel.light;
    this.$vuetify.theme.themes.dark = themes.sempapel.dark;
  },
});
</script>
