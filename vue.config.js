module.exports = {
  pluginOptions: {
    electronBuilder: {
      mainProcessFile: "src.mainproc/main.ts",
      renderProcessFile: "src/main.ts",
      builderOptions: {
        asar: false,
        extraResources: [
          {
            from: "src.mainproc/preload",
            to: "app/preload",
            filter: "**/*",
          },
        ],
        publish: ["github"],
        appId: "com.electron.nadpuppeteer",
        productName: "NADPuppeteer",
        copyright: "© 2022 Cosmzs#3113",
        directories: {
          output: "dist_electron",
          buildResources: "build",
        },
        win: {
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
