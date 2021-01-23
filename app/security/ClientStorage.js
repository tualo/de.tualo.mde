Ext.define('TualoMDE.security.ClientStorage', {
    singleton: true,
    storageKey: 'json-web-client',

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