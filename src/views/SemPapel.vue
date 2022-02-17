<template>
  <v-container>
    <UI />
    <router-view> </router-view>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import UI from "../components/SemPapel/UI.vue";

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
});
</script>
