module.exports = {
  pluginOptions: {
    quasar: {
      importStrategy: 'kebab',
      rtlSupport: false
    },
    electronBuilder: {
      builderOptions: {
        extraFiles: {
          from: 'src/database/database_schema.sql',
          to: './resources/database_schema.sql'
        }
      }
    },
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      localeDir: 'lang',
      enableInSFC: true
    }
  },
  transpileDependencies: ["quasar"],
};
