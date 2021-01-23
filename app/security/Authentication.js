Ext.define('TualoMDE.security.Authentication', {
    singleton: true,
    requires: [
        'TualoMDE.security.TokenStorage',
        'TualoMDE.security.UrlStorage',
        'TualoMDE.security.ClientStorage'
    ],

    isLoggedIn: function() {
        var deferred = new Ext.Deferred();
        deferred.resolve( (null !== TualoMDE.security.TokenStorage.retrieve()) && (null !== TualoMDE.security.ClientStorage.retrieve()) );
        return deferred.promise;
    },

    login: function(username, password) {
        var deferred = new Ext.Deferred();

        Ext.Ajax.request({
            url: TualoMDE.security.UrlStorage.retrieve(),
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
                        TualoMDE.security.ClientStorage.save(data);
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
                TualoMDE.security.TokenStorage.clear();
                deferred.reject(data, response);
            }
        });

        return deferred.promise;
    },

    registerClient: function(sid){
        var deferred = new Ext.Deferred();
        Ext.Ajax.request({
            url: TualoMDE.security.UrlStorage.retrieve()+'_/'+sid+'/mdesync/registerclient',
            method: 'GET',
            params: {
                'path': '/mdesync/*'
            },
            success: function (response) {
                var data = Ext.decode(response.responseText);
                if (data.token) {
                    TualoMDE.security.TokenStorage.save(data.token);
                    deferred.resolve(data, response);
                } else {
                    deferred.reject(data, response);
                }
            },

            failure: function (response) {
                var data = Ext.decode(response.responseText);
                TualoMDE.security.TokenStorage.clear();
                deferred.reject(data, response);
            }
        });

        return deferred.promise;

    },

    logout: function(callback) {
        TualoMDE.security.TokenStorage.clear();

        // The "old" way of using callbacks. You can easily rewrite this using Promise, too, see login method.
        callback();
    }
}, function () {
    Ext.Ajax.on('beforerequest', function(conn, options) {

        if (TualoMDE.security.Authentication.isLoggedIn()) {
            if (TualoMDE.security.TokenStorage.retrieve()!==null){
                options.headers = options.headers || {};
                options.headers['Authorization'] = '' + TualoMDE.security.TokenStorage.retrieve();
            }
        }
    });
})