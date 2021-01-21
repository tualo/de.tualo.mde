Ext.define('App.security.Authentication', {
    singleton: true,
    requires: [
        'App.security.TokenStorage',
        'App.security.UrlStorage',
        'App.security.ClientStorage'
    ],

    isLoggedIn: function() {
        var deferred = new Ext.Deferred();
        deferred.resolve( (null !== App.security.TokenStorage.retrieve()) && (null !== App.security.ClientStorage.retrieve()) );
        return deferred.promise;
    },

    login: function(username, password) {
        var deferred = new Ext.Deferred();

        Ext.Ajax.request({
            url: App.security.UrlStorage.retrieve(),
            method: 'POST',

            params: {
                'username': username,
                'password': password,
                'forcelogin': 1
            },
            scope: this,
            success: function (response) {
                console.log(response);
                var data = Ext.decode(response.responseText);
                if (data.success) {
                    this.registerClient(data.sid).then(function(dataregister,response){
                        App.security.ClientStorage.save(data);
                        deferred.resolve(dataregister,response)
                    }).catch(function(data,response){
                        deferred.reject(data,response)
                    });
                } else {
                    deferred.reject(data, response);
                }
            },

            failure: function (response) {
                var data = Ext.decode(response.responseText);
                App.security.TokenStorage.clear();
                deferred.reject(data, response);
            }
        });

        return deferred.promise;
    },

    registerClient: function(sid){
        var deferred = new Ext.Deferred();
        Ext.Ajax.request({
            url: App.security.UrlStorage.retrieve()+'_/'+sid+'/mdesync/registerclient',
            method: 'GET',
            params: {
                'path': '/mdesync/*'
            },
            success: function (response) {
                var data = Ext.decode(response.responseText);
                if (data.token) {
                    App.security.TokenStorage.save(data.token);
                    deferred.resolve(data, response);
                } else {
                    deferred.reject(data, response);
                }
            },

            failure: function (response) {
                var data = Ext.decode(response.responseText);
                App.security.TokenStorage.clear();
                deferred.reject(data, response);
            }
        });

        return deferred.promise;

    },

    logout: function(callback) {
        App.security.TokenStorage.clear();

        // The "old" way of using callbacks. You can easily rewrite this using Promise, too, see login method.
        callback();
    }
}, function () {
    Ext.Ajax.on('beforerequest', function(conn, options) {

        if (App.security.Authentication.isLoggedIn()) {
            if (App.security.TokenStorage.retrieve()!==null){
                options.headers = options.headers || {};
                options.headers['Authorization'] = '' + App.security.TokenStorage.retrieve();
            }
        }
    });
})