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
        <div style="width: 100%; margin-bottom: 30px">
          <div
            class="text-right"
            :style="`width: ${progress.value}%; transition: width .3s`"
          >
            <v-icon dense class="progress-icon" v-if="value > 0">
              {{ icon }}
            </v-icon>
          </div>
        </div>
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
      if (progress.value >= 100)
        setTimeout(() => {
          this.progress.value = 0;
        }, 1500);
      this.progress = {
        ...this.$root.$data.progress,
        ...progress,
        visible: true,
      };
    },
  },

  computed: {
    icon(): string {
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
