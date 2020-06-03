module.exports = {
  pluginOptions: {
    quasar: {
      importStrategy: "kebab",
      rtlSupport: false,
    },
    electronBuilder: {
      builderOptions: {
        //extraResources: ["src/database/database_schema.sql"],
        extraFiles: {
          from: "src/database/database_schema.sql",
          to: "./resources/database_schema.sql",
        },
      },
    },
  },
  transpileDependencies: ["quasar"],
};
