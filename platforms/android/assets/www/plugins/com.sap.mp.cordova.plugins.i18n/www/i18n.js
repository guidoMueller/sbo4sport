cordova.define("com.sap.mp.cordova.plugins.i18n.i18n", function(require, exports, module) { // 3.7.1
var exec = require('cordova/exec');
var defaultLocale = "en";

function getUserLocale() {
    var locale;

    // Workaround for Android 2.3.x
    if (navigator && navigator.userAgent && (androidLang = navigator.userAgent.match(/android.*\W(\w\w)-(\w\w)\W/i))) {
        locale = androidLang[1];
    } else {
        locale = navigator.userLanguage || navigator.language;
    }

    locale = locale.replace('-', '_');

    return locale.toLowerCase();
}

function loadMessages(i18n, callback) {
    // Messages are loaded in the following order language_territory, language, and default
    // eg.  messages_en_us.json, messages_en.json, messages_{default}.json
    var userLocale = getUserLocale(),
        lang = userLocale.split('_')[0],
        locales = [userLocale];

    i18n.messages = {};

    // Could be en_US and en
    if (userLocale !== lang) {
        locales.push(lang);
    }

	if (!(defaultLocale in locales)) {
    	locales.push(defaultLocale); // Default
	}
    
    exec(function(messages){
        i18n.messages = messages;
        if (callback) {
            callback(i18n);
        }
    }, callback, 'i18n', 'getMessages', [locales, i18n.path, i18n.name]);
}

var i18n = function (options) {
    this.name = options.name ? options.name : "messages";
    this.path = options.path;
    this.messages = null;
}

i18n.prototype.get = function (key) {
    for (var locale in this.messages) {
        if (this.messages[locale][key]) {
            return this.messages[locale][key];
        }
    }
}

module.exports.load = function (options, callback) {
    var bundle = new i18n(options);
    loadMessages(bundle, callback);
}
});
