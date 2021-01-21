Ext.define('App.security.RemoteSetupStorage', {
    singleton: true,
    storageKey: 'json-web-remotesetup',

    clear: function () {
        localStorage.removeItem(this.storageKey);
    },

    retrieve: function() {
        let res = localStorage.getItem(this.storageKey);
        if (typeof res == 'string'){
            try{
                res = JSON.parse(res);
            }catch(e){
                return null;
            }
        }
        return res;
    },

    save: function (data) {
        localStorage.setItem(this.storageKey, JSON.stringify(data));
    }
});