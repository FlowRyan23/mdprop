module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],

  publicPath: '/dist',

  pluginOptions: {
    i18n: {
      locale: "en",
      fallbackLocale: "en",
      localeDir: "locales",
      enableInSFC: false,
      enableBridge: false
    }
  }
}
