Ext.define('TualoMDE.security.UrlStorage', {
    singleton: true,
    storageKey: 'json-web-url',

    clear: function () {
        localStorage.removeItem(this.storageKey);
    },

    retrieve: function() {
        return localStorage.getItem(this.storageKey);
    },

    save: function (token) {
        localStorage.setItem(this.storageKey, token);
    }
});