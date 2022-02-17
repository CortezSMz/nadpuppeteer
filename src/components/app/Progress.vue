<template>
  <v-footer padless app style="z-index: 100">
    <v-progress-linear
      style="overflow: visible"
      height="5px"
      :v-model="this.$root.$data.alert.icon"
      :active="progress.visible"
      :color="this.$root.$data.alert.color"
      :value="progress.value"
      :buffer-value="progress.buffer"
      :stream="progress.stream"
      :indeterminate="progress.indeterminate"
      :query="progress.query"
      v-if="progress.value > 0"
    >
      <template v-slot:default="{ value }" style="">
        <v-container style="margin-top: -30px">
          <v-row style="padding: -10px; margin: -10px">
            <div
              v-for="i in Array(Math.min(95, value))"
              :key="i"
              style="width: 1%"
            ></div>
            <v-icon
              style="transform: translateX(valuepx)"
              dense
              class="progress-icon"
              v-if="value > 0"
            >
              {{ getIcon() }}
            </v-icon>
          </v-row>
        </v-container>
      </template>
    </v-progress-linear>
  </v-footer>
</template>

<style scoped>
.progress-icon {
  animation: 1s,
    bounce 0.35s infinite alternate-reverse cubic-bezier(0.05, 0.05, 0.7, 0.05);
}

@keyframes bounce {
  from {
    transform: translateY(-40px);
  }
  to {
    transform: translateY(0px);
  }
}
</style>

<script lang="ts">
import Vue from "vue";

import { ProgressOptions } from "../../main";
import { ipcRenderer } from "electron";
declare var api: {
  progress: (callback: (progress: ProgressOptions) => void) => void;
};

export default Vue.extend({
  name: "Progress",

  data() {
    return {
      progress: {
        ...this.$root.$data.progress,
      },
    };
  },

  methods: {
    setProgress(progress: ProgressOptions) {
      console.log("setProgress", progress);
      if (progress.value >= 100) progress.value = 0;
      this.progress = {
        ...this.$root.$data.progress,
        ...progress,
        visible: true,
      };
    },

    getIcon() {
      return this.$root.$data.alert.icon;
    },
  },

  mounted() {
    api.progress((progress: ProgressOptions) => {
      this.setProgress(progress);
    });
  },
});
</script>
