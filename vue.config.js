module.exports = {
  pluginOptions: {
    electronBuilder: {
      preload: "src.mainproc/windows/preload.js",
      mainProcessFile: "src.mainproc/main.ts",
      renderProcessFile: "src/main.ts",
      builderOptions: {
        appId: "com.electron.nadpuppeteer",
        productName: "NADPuppeteer",
        copyright: "© 2022 Cosmzs#3113",
        directories: {
          output: "dist_electron",
        },
        publish: [
          {
            provider: "github",
            owner: "CortezSMz",
            repo: "nadpuppeteer",
          },
        ],
        win: {
          publish: ["github"],
          target: "squirrel",
          icon: "./src/assets/icon.ico",
        },
        squirrelWindows: {
          iconUrl:
            "https://iconarchive.com/download/i59798/firstfear/whistlepuff/programs.ico",
        },
      },
    },
  },
  transpileDependencies: ["vuetify"],
};
