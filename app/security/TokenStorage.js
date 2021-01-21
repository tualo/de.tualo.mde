Ext.define('App.security.TokenStorage', {
    singleton: true,
    storageKey: 'json-web-token',

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